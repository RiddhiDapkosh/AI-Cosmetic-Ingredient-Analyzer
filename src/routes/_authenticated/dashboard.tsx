import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Beaker, BookmarkCheck, ScanLine, ShieldAlert, Sparkles } from "lucide-react";
import { SafetyScore } from "@/components/SafetyScore";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — CosmetiScan AI" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const { data: recent } = await supabase
        .from("analyses")
        .select("id, product_name, safety_score, risk_level, created_at, saved")
        .order("created_at", { ascending: false })
        .limit(6);
      const { count } = await supabase
        .from("analyses")
        .select("*", { count: "exact", head: true });
      const { data: saved } = await supabase
        .from("analyses")
        .select("id, product_name, safety_score")
        .eq("saved", true)
        .order("created_at", { ascending: false })
        .limit(4);
      return { recent: recent ?? [], total: count ?? 0, saved: saved ?? [] };
    },
  });

  const avgScore =
    data && data.recent.length
      ? Math.round(
          data.recent.reduce((s, r) => s + (r.safety_score ?? 0), 0) / data.recent.length,
        )
      : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Your skincare research at a glance.</p>
        </div>
        <Link to="/analyzer">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <ScanLine className="mr-2 h-4 w-4" /> New analysis
          </Button>
        </Link>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Beaker} label="Total analyses" value={data?.total ?? "—"} />
        <Stat icon={BookmarkCheck} label="Saved products" value={data?.saved.length ?? "—"} />
        <Stat icon={Sparkles} label="Avg recent score" value={avgScore || "—"} accent />
        <Stat
          icon={ShieldAlert}
          label="High-risk in recent"
          value={data?.recent.filter((r) => r.risk_level === "High").length ?? "—"}
        />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Recent analyses</h2>
            <Link to="/history" className="text-sm text-mint hover:underline">
              View all <ArrowRight className="ml-0.5 inline h-3 w-3" />
            </Link>
          </div>
          {isLoading ? (
            <Skeleton />
          ) : data && data.recent.length ? (
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <ul className="divide-y divide-border">
                {data.recent.map((r) => (
                  <li key={r.id}>
                    <Link
                      to="/analysis/$id"
                      params={{ id: r.id }}
                      className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-surface"
                    >
                      <div>
                        <div className="font-medium text-foreground">{r.product_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(r.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <RiskPill level={r.risk_level} />
                        <span className="text-lg font-semibold text-foreground tabular-nums">
                          {r.safety_score ?? "—"}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <EmptyState />
          )}
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">Average safety</h2>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-8">
            <SafetyScore score={avgScore} />
            <p className="mt-4 max-w-[200px] text-center text-sm text-muted-foreground">
              Based on your {data?.recent.length ?? 0} most recent analyses.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Beaker;
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className={`h-4 w-4 ${accent ? "text-mint" : "text-muted-foreground"}`} />
      </div>
      <div className={`mt-2 text-3xl font-bold tabular-nums ${accent ? "text-mint" : "text-foreground"}`}>
        {value}
      </div>
    </div>
  );
}

function RiskPill({ level }: { level: string | null }) {
  if (!level) return null;
  const tone =
    level === "Low"
      ? "bg-mint/10 text-mint"
      : level === "Medium"
        ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
        : "bg-destructive/10 text-destructive";
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tone}`}>{level} risk</span>;
}

function Skeleton() {
  return (
    <div className="space-y-2">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-16 animate-pulse rounded-xl bg-surface" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
      <p className="text-foreground">No analyses yet.</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Scan your first product to start building your skincare history.
      </p>
      <Link to="/analyzer" className="mt-4 inline-block">
        <Button className="bg-mint text-mint-foreground hover:bg-mint/90">
          <ScanLine className="mr-2 h-4 w-4" /> Analyze a product
        </Button>
      </Link>
    </div>
  );
}