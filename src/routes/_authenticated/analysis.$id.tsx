import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SafetyScore } from "@/components/SafetyScore";
import { IngredientCard } from "@/components/IngredientCard";
import type { IngredientDetail } from "@/lib/types";
import { ArrowLeft, Bookmark, BookmarkCheck, Check, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/analysis/$id")({
  head: () => ({ meta: [{ title: "Analysis — CosmetiScan AI" }] }),
  component: AnalysisPage,
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="text-xl font-semibold text-foreground">Couldn't load this analysis</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <Button
          className="mt-4"
          onClick={() => {
            router.invalidate();
            reset();
          }}
        >
          Try again
        </Button>
      </div>
    );
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <h1 className="text-xl font-semibold text-foreground">Analysis not found</h1>
      <Link to="/history" className="mt-3 inline-block text-mint hover:underline">
        Back to history
      </Link>
    </div>
  ),
});

function AnalysisPage() {
  const { id } = Route.useParams();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["analysis", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("analyses").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data;
    },
  });

  async function toggleSave() {
    if (!data) return;
    const { error } = await supabase.from("analyses").update({ saved: !data.saved }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(!data.saved ? "Saved" : "Removed from saved");
    qc.invalidateQueries({ queryKey: ["analysis", id] });
  }

  if (isLoading || !data) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="h-72 animate-pulse rounded-2xl bg-surface" />
      </div>
    );
  }

  const ingredients = (data.ingredients as unknown as IngredientDetail[]) ?? [];
  const risky = (data.risky_ingredients as unknown as string[]) ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link to="/history" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to history
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{data.product_name}</h1>
                <p className="mt-1 text-xs text-muted-foreground">
                  Analyzed {new Date(data.created_at).toLocaleString()}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={toggleSave}>
                {data.saved ? (
                  <>
                    <BookmarkCheck className="mr-2 h-4 w-4 text-mint" /> Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="mr-2 h-4 w-4" /> Save
                  </>
                )}
              </Button>
            </div>
            <p className="mt-4 text-foreground">{data.summary}</p>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <SuitabilityChip label="Oily skin" ok={data.safe_oily} />
              <SuitabilityChip label="Dry skin" ok={data.safe_dry} />
              <SuitabilityChip label="Sensitive" ok={data.safe_sensitive} />
              <SuitabilityChip label="Pregnancy" ok={data.safe_pregnancy} />
            </div>

            {risky.length > 0 && (
              <div className="mt-5 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                <p className="text-sm font-semibold text-destructive">Risky ingredients detected</p>
                <p className="mt-1 text-sm text-foreground">{risky.join(", ")}</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <SafetyScore score={data.safety_score ?? 0} size={160} />
          <div className="mt-4 text-sm text-muted-foreground">Overall risk level</div>
          <div className="mt-1 text-lg font-semibold text-foreground">{data.risk_level ?? "—"}</div>
        </div>
      </div>

      <h2 className="mb-3 mt-10 text-lg font-semibold text-foreground">
        Ingredients ({ingredients.length})
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {ingredients.map((ing, i) => (
          <IngredientCard key={`${ing.name}-${i}`} ing={ing} />
        ))}
      </div>
    </div>
  );
}

function SuitabilityChip({ label, ok }: { label: string; ok: boolean | null }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm">
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full ${
          ok ? "bg-mint/15 text-mint" : "bg-destructive/10 text-destructive"
        }`}
      >
        {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      </span>
      <span className="text-foreground">{label}</span>
    </div>
  );
}