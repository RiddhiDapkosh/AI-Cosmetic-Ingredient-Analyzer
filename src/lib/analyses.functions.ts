import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import type { AnalysisResult } from "./types";

const InputSchema = z.object({
  productName: z.string().min(1).max(200),
  imageBase64: z.string().optional(), // data URL or raw base64
  imageMime: z.string().optional(),
  text: z.string().max(8000).optional(),
});

const SYSTEM = `You are a senior cosmetic chemist. Analyze a cosmetic/skincare product's ingredient list and respond with STRICT JSON only (no prose, no markdown fences). If an image is provided, first OCR the ingredient list from it.

Schema:
{
  "product_name": string,
  "summary": string (2-4 sentences, plain English),
  "safety_score": integer 0-100 (higher = safer),
  "risk_level": "Low" | "Medium" | "High",
  "safe_oily": boolean,
  "safe_dry": boolean,
  "safe_sensitive": boolean,
  "safe_pregnancy": boolean,
  "risky_ingredients": string[] (ingredient names flagged as concerning),
  "ingredients": [
    {
      "name": string,
      "purpose": string,
      "benefits": string,
      "side_effects": string,
      "safety_level": "Low" | "Medium" | "High",
      "pregnancy_safe": boolean,
      "suitable_skin_types": string[] (subset of ["oily","dry","combination","sensitive","normal","acne-prone"]),
      "comedogenic_rating": integer 0-5,
      "allergy_warnings": string,
      "alternatives": string[]
    }
  ]
}

Rules:
- Cap ingredients to the first 20 if a list is very long.
- safety_level "Low" means LOW RISK (safer). "High" means HIGH RISK.
- If ingredients cannot be determined, return safety_score 0, risk_level "High", and an empty ingredients array with a summary explaining the issue.
- Output JSON only.`;

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Model returned no JSON");
  return JSON.parse(candidate.slice(start, end + 1));
}

export const analyzeProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data, context }): Promise<{ id: string; result: AnalysisResult }> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI is not configured.");
    if (!data.imageBase64 && !data.text) {
      throw new Error("Provide an image or paste the ingredients list.");
    }

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");

    const userContent: Array<
      { type: "text"; text: string } | { type: "image"; image: string; mediaType?: string }
    > = [
      {
        type: "text",
        text: `Product name: ${data.productName}\n${data.text ? `Ingredient list (from user):\n${data.text}` : "Ingredient list is on the attached product image — OCR it first."}`,
      },
    ];
    if (data.imageBase64) {
      const dataUrl = data.imageBase64.startsWith("data:")
        ? data.imageBase64
        : `data:${data.imageMime ?? "image/jpeg"};base64,${data.imageBase64}`;
      userContent.push({ type: "image", image: dataUrl });
    }

    let raw: string;
    try {
      const res = await generateText({
        model,
        system: SYSTEM,
        messages: [{ role: "user", content: userContent }],
      });
      raw = res.text;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "AI request failed";
      if (/429/.test(msg)) throw new Error("AI rate limit reached. Try again in a moment.");
      if (/402/.test(msg)) throw new Error("AI credits exhausted. Add credits in Workspace billing.");
      throw new Error(msg);
    }

    const parsed = extractJson(raw) as AnalysisResult;
    parsed.product_name = parsed.product_name || data.productName;

    const { data: inserted, error } = await context.supabase
      .from("analyses")
      .insert({
        user_id: context.userId,
        product_name: parsed.product_name,
        raw_text: data.text ?? null,
        summary: parsed.summary,
        safety_score: parsed.safety_score,
        risk_level: parsed.risk_level,
        safe_oily: parsed.safe_oily,
        safe_dry: parsed.safe_dry,
        safe_sensitive: parsed.safe_sensitive,
        safe_pregnancy: parsed.safe_pregnancy,
        risky_ingredients: (parsed.risky_ingredients ?? []) as unknown as never,
        ingredients: (parsed.ingredients ?? []) as unknown as never,
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    return { id: inserted.id, result: parsed };
  });