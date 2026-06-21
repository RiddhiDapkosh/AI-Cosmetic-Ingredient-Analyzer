import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { analyzeProduct } from "@/lib/analyses.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ImagePlus, Loader2, ScanLine, Upload, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/analyzer")({
  head: () => ({ meta: [{ title: "Ingredient Analyzer — CosmetiScan AI" }] }),
  component: Analyzer,
});

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function Analyzer() {
  const navigate = useNavigate();
  const analyze = useServerFn(analyzeProduct);
  const [productName, setProductName] = useState("");
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    if (!/^image\/(png|jpe?g|webp)$/i.test(file.type)) {
      toast.error("Please upload a JPG, PNG, or WEBP image.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be under 8MB.");
      return;
    }
    setImageFile(file);
    fileToBase64(file).then(setImagePreview);
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!productName.trim()) return toast.error("Give the product a name.");
    if (!imageFile && !text.trim()) {
      return toast.error("Upload an image or paste an ingredient list.");
    }
    setLoading(true);
    try {
      const imageBase64 = imageFile ? await fileToBase64(imageFile) : undefined;
      const { id } = await analyze({
        data: {
          productName: productName.trim(),
          text: text.trim() || undefined,
          imageBase64,
          imageMime: imageFile?.type,
        },
      });
      toast.success("Analysis ready.");
      navigate({ to: "/analysis/$id", params: { id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Analysis failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Ingredient analyzer</h1>
        <p className="mt-1 text-muted-foreground">
          Upload a label photo or paste an ingredient list. We'll analyze every ingredient and score the product.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="product">Product name</Label>
          <Input
            id="product"
            placeholder="e.g. CeraVe Daily Moisturizing Lotion"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>

        <Tabs defaultValue="image" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="image">
              <ImagePlus className="mr-2 h-4 w-4" /> Upload image
            </TabsTrigger>
            <TabsTrigger value="text">Paste ingredients</TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="mt-4">
            {imagePreview ? (
              <div className="relative overflow-hidden rounded-xl border border-border">
                <img src={imagePreview} alt="Product label preview" className="w-full" />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label
                className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-surface px-6 py-12 text-center transition-colors hover:border-mint hover:bg-mint/5"
              >
                <Upload className="h-7 w-7 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Click to upload product image</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">JPG, PNG, or WEBP up to 8MB</p>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
              </label>
            )}
          </TabsContent>

          <TabsContent value="text" className="mt-4">
            <Textarea
              rows={8}
              placeholder="Aqua, Glycerin, Niacinamide, Cetearyl Alcohol, ..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Paste the full ingredient list — typically labeled "Ingredients" on the back.
            </p>
          </TabsContent>
        </Tabs>

        <Button
          type="submit"
          disabled={loading}
          className="mt-6 h-11 w-full bg-primary text-base text-primary-foreground hover:bg-primary/90"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing — this can take ~15s
            </>
          ) : (
            <>
              <ScanLine className="mr-2 h-4 w-4" /> Analyze product
            </>
          )}
        </Button>
      </form>
    </div>
  );
}