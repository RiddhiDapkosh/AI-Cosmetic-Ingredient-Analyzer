import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Camera,
  ScanLine,
  ShieldCheck,
  Sparkles,
  HeartPulse,
  Beaker,
  History,
  Leaf,
  ArrowRight,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CosmetiScan AI — Decode any cosmetic ingredient list" },
      {
        name: "description",
        content:
          "Snap a label or paste an ingredient list. CosmetiScan AI explains every ingredient, flags risks, and scores product safety.",
      },
      { property: "og:title", content: "CosmetiScan AI" },
      {
        property: "og:description",
        content: "AI-powered cosmetic ingredient analysis with safety scores.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="gradient-clinical relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-xs font-medium text-mint">
              <Sparkles className="h-3.5 w-3.5" /> AI-powered ingredient analysis
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Know exactly what's <span className="text-mint">on your skin</span>.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground sm:text-xl">
              Snap a product label or paste an ingredient list. CosmetiScan AI explains
              every ingredient, flags risks, and gives you a clear safety score in seconds.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/auth" search={{ mode: "signup" }}>
                <Button size="lg" className="h-12 bg-primary px-6 text-base text-primary-foreground hover:bg-primary/90">
                  Analyze a product free <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <a href="#how">
                <Button size="lg" variant="outline" className="h-12 px-6 text-base">
                  How it works
                </Button>
              </a>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              No credit card. Works with any skincare, haircare, or cosmetic product.
            </p>
          </div>

          {/* Preview card */}
          <div className="mx-auto mt-16 max-w-3xl">
            <div className="rounded-2xl border border-border bg-card p-2 shadow-xl shadow-primary/5">
              <div className="rounded-xl bg-surface p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <div className="font-semibold text-foreground">Glow Daily Moisturizer</div>
                    <div className="text-muted-foreground">18 ingredients analyzed</div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-mint">86</div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      Safety score
                    </div>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Oily skin", ok: true },
                    { label: "Dry skin", ok: true },
                    { label: "Sensitive", ok: true },
                    { label: "Pregnancy", ok: false },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm"
                    >
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full ${
                          s.ok ? "bg-mint/15 text-mint" : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {s.ok ? <Check className="h-3 w-3" /> : "!"}
                      </span>
                      <span className="text-foreground">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to shop smarter
          </h2>
          <p className="mt-3 text-muted-foreground">
            Built on the latest AI models and a curated ingredient knowledge base.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Camera, title: "Scan any label", desc: "Upload a photo of the back of a product — our AI reads the ingredient list for you." },
            { icon: Beaker, title: "Ingredient-level detail", desc: "Purpose, benefits, side effects, comedogenic rating, and pregnancy safety per ingredient." },
            { icon: ShieldCheck, title: "Safety score", desc: "A clear 0–100 score with risk level and flagged ingredients you should know about." },
            { icon: HeartPulse, title: "Skin-type fit", desc: "Tells you if a product is suited for oily, dry, sensitive skin or during pregnancy." },
            { icon: Leaf, title: "Better alternatives", desc: "Suggests gentler swaps for risky ingredients so you can rebuild a safer routine." },
            { icon: History, title: "Your history", desc: "Every scan is saved. Re-open any analysis or save favorites for later." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-mint/10 text-mint">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-surface py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              From label to insight in seconds
            </h2>
            <p className="mt-3 text-muted-foreground">
              Three simple steps. No chemistry degree required.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { step: "01", icon: Camera, title: "Upload or paste", desc: "Snap the back of the bottle or paste the ingredient list." },
              { step: "02", icon: ScanLine, title: "AI analyzes", desc: "We OCR the label and look up every ingredient in our knowledge base." },
              { step: "03", icon: ShieldCheck, title: "Get a verdict", desc: "Safety score, risk level, skin-type fit, and ingredient-by-ingredient details." },
            ].map((s) => (
              <div key={s.step} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-widest text-mint">{s.step}</span>
                  <s.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Built for people who actually read the back of the bottle.
            </h2>
            <p className="mt-4 text-muted-foreground">
              CosmetiScan AI turns dense INCI lists into clear, trustworthy guidance — so you can
              choose products that work with your skin, not against it.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Spot harsh actives, fragrances, and allergens at a glance",
                "Pregnancy-safety flags backed by clinical guidance",
                "Comedogenic ratings for acne-prone skin",
                "Save products and revisit your full analysis history",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3 text-foreground">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-mint/15 text-mint">
                    <Check className="h-3 w-3" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-gradient-to-br from-card to-surface p-8">
            <div className="space-y-4">
              {[
                { name: "Niacinamide", note: "Brightens, calms redness", level: "Low" },
                { name: "Retinol", note: "Avoid during pregnancy", level: "High" },
                { name: "Hyaluronic Acid", note: "Hydrating, sensitive-safe", level: "Low" },
                { name: "Fragrance (Parfum)", note: "Common allergen", level: "Medium" },
              ].map((i) => (
                <div key={i.name} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                  <div>
                    <div className="text-sm font-semibold text-foreground">{i.name}</div>
                    <div className="text-xs text-muted-foreground">{i.note}</div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      i.level === "Low"
                        ? "bg-mint/10 text-mint"
                        : i.level === "Medium"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                          : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {i.level} risk
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-4xl rounded-3xl bg-primary p-10 text-center text-primary-foreground sm:p-14">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Start scanning your shelf today.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
            Free to try. Sign up in seconds and analyze your first product.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link to="/auth" search={{ mode: "signup" }}>
              <Button size="lg" className="h-12 bg-mint px-6 text-base text-mint-foreground hover:bg-mint/90">
                Create free account
              </Button>
            </Link>
            <Link to="/auth" search={{ mode: "signin" }}>
              <Button size="lg" variant="outline" className="h-12 border-primary-foreground/30 bg-transparent px-6 text-base text-primary-foreground hover:bg-primary-foreground/10">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 sm:flex-row sm:px-6">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} CosmetiScan AI. For educational use; not medical advice.</p>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Home</Link>
        </div>
      </footer>
    </div>
  );
}
