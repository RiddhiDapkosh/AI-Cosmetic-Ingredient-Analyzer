import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Search, Trash2, Bookmark, BookmarkCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/history")({
  head: () => ({ meta: [{ title: "Analysis History — CosmetiScan AI" }] }),
  component: History,
});

function History() {
  const qc = useQueryClient();
  const [query, setQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analyses")
        .select("id, product_name, safety_score, risk_level, summary, saved, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = (data ?? []).filter((r) =>
    `${r.product_name} ${r.summary ?? ""}`.toLowerCase().includes(query.toLowerCase()),
  );

  async function toggleSave(id: string, saved: boolean) {
    const { error } = await supabase.from("analyses").update({ saved: !saved }).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["history"] });
  }

  async function remove(id: string) {
    if (!confirm("Delete this analysis?")) return;
    const { error } = await supabase.from("analyses").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted.");
    qc.invalidateQueries({ queryKey: ["history"] });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Analysis history</h1>
          <p className="mt-1 text-muted-foreground">Every product you've analyzed.</p>
        </div>
        <Link to="/analyzer">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">New analysis</Button>
        </Link>
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-xl border border-border bg-card px-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by product or keyword"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border-0 px-0 shadow-none focus-visible:ring-0"
        />
      </div>

      <div className="mt-6 space-y-3">
        {isLoading && Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-surface" />
        ))}

        {!isLoading && filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <p className="text-foreground">No analyses found.</p>
            <p className="mt-1 text-sm text-muted-foreground">Try a different search, or run a new analysis.</p>
          </div>
        )}

        {filtered.map((r) => (
          <div key={r.id} className="group rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <Link to="/analysis/$id" params={{ id: r.id }} className="min-w-0 flex-1">
                <h3 className="truncate text-base font-semibold text-foreground group-hover:text-mint">
                  {r.product_name}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.summary}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleString()}
                </p>
              </Link>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground tabular-nums">
                    {r.safety_score ?? "—"}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {r.risk_level ?? ""} risk
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => toggleSave(r.id, r.saved)}
                  title={r.saved ? "Unsave" : "Save"}
                >
                  {r.saved ? <BookmarkCheck className="h-4 w-4 text-mint" /> : <Bookmark className="h-4 w-4" />}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => remove(r.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}