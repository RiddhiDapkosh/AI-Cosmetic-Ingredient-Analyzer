export interface IngredientDetail {
  name: string;
  purpose: string;
  benefits: string;
  side_effects: string;
  safety_level: "Low" | "Medium" | "High";
  pregnancy_safe: boolean;
  suitable_skin_types: string[];
  comedogenic_rating: number; // 0-5
  allergy_warnings: string;
  alternatives: string[];
}

export interface AnalysisResult {
  product_name: string;
  summary: string;
  safety_score: number; // 0-100
  risk_level: "Low" | "Medium" | "High";
  safe_oily: boolean;
  safe_dry: boolean;
  safe_sensitive: boolean;
  safe_pregnancy: boolean;
  risky_ingredients: string[];
  ingredients: IngredientDetail[];
}