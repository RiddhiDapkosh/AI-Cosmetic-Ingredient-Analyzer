import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import type { IngredientDetail } from "@/lib/types";

export function IngredientCard({ ing }: { ing: IngredientDetail }) {
  const tone =
    ing.safety_level === "Low"
      ? "text-mint border-mint/40 bg-mint/10"
      : ing.safety_level === "Medium"
        ? "text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-500/10"
        : "text-destructive border-destructive/30 bg-destructive/10";

  const Icon =
    ing.safety_level === "Low" ? ShieldCheck : ing.safety_level === "Medium" ? ShieldQuestion : ShieldAlert;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">{ing.name}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{ing.purpose}</p>
        </div>
        <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${tone}`}>
          <Icon className="h-3.5 w-3.5" />
          {ing.safety_level} risk
        </div>
      </div>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <Field label="Benefits" value={ing.benefits} />
        <Field label="Side effects" value={ing.side_effects} />
        <Field label="Comedogenic" value={`${ing.comedogenic_rating}/5`} />
        <Field
          label="Pregnancy"
          value={ing.pregnancy_safe ? "Considered safe" : "Use with caution"}
        />
        <Field label="Allergy notes" value={ing.allergy_warnings || "None reported"} />
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Skin types</dt>
          <dd className="mt-1 flex flex-wrap gap-1">
            {(ing.suitable_skin_types ?? []).map((t) => (
              <Badge key={t} variant="secondary" className="font-normal capitalize">
                {t}
              </Badge>
            ))}
          </dd>
        </div>
      </dl>

      {ing.alternatives?.length ? (
        <div className="mt-4 border-t border-border pt-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Alternatives</p>
          <p className="mt-1 text-sm text-foreground">{ing.alternatives.join(", ")}</p>
        </div>
      ) : null}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-foreground">{value}</dd>
    </div>
  );
}