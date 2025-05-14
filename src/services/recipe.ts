import api from "./api";
import { toast } from "sonner";

export interface Recipe {
  id?: number;
  title: string;
  ingredients: string[];
  instructions: string[];
  original_url?: string;
  image_url?: string;
}

export interface RecipeURL {
  url: string;
}

export const extractRecipe = async (recipeUrl: RecipeURL) => {
  try {
    const response = await api.post("/extract-recipe", recipeUrl);
    return response.data;
  } catch (error) {
    console.error("Recipe extraction error:", error);
    throw error;
  }
};

export const saveRecipe = async (recipe: Recipe) => {
  try {
    const response = await api.post("/save-recipe", recipe);
    toast.success("Recipe saved successfully!");
    return response.data;
  } catch (error) {
    console.error("Save recipe error:", error);
    throw error;
  }
};

export const getUserRecipes = async () => {
  try {
    const response = await api.get("/recipes");
    return response.data;
  } catch (error) {
    console.error("Get recipes error:", error);
    throw error;
  }
};

export const deleteRecipe = async (recipeId: number) => {
  try {
    await api.delete(`/recipes/${recipeId}`);
    toast.success("Recipe deleted successfully!");
    return true;
  } catch (error) {
    console.error("Delete recipe error:", error);
    toast.error("Failed to delete recipe");
    throw error;
  }
};
