import { useState } from "react";
import { extractRecipe, saveRecipe } from "@/services/recipe";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import TypingPlaceholder from "./TypingPlaceholder";

const RecipeImport = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState("");
  const navigate = useNavigate();

  const placeholderSuggestions = [
    "https://www.allrecipes.com",
    "Try a recipe from NYTimes Cooking...",
    "Have a favorite recipe on YouTube? Paste the link here!",
    "Paste that amazing cookie recipe from food52.com",
    "Find a tasty dinner idea on bonappetit.com",
    "Got a cool Tasty video to try? Add it here!",
    "https://www.bbcgoodfood.com",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url) {
      toast.error("Please enter a recipe URL");
      return;
    }

    setIsLoading(true);

    try {
      // Extract recipe from URL
      const extractedRecipe = await extractRecipe({ url });

      // Save recipe to database
      await saveRecipe(extractedRecipe);

      // Reset form and redirect
      setUrl("");
      navigate("/recipes");
    } catch (error) {
      console.error("Recipe import failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Import Recipe</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="recipeUrl" className="text-lg font-medium">Recipe URL</label>
          <Input
            id="recipeUrl"
            type="url"
            placeholder={placeholder}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="w-full h-12 px-4"
          />
          <TypingPlaceholder
            suggestions={placeholderSuggestions}
            onPlaceholderChange={setPlaceholder}
            typingSpeed={80}
            deletingSpeed={30}
            pauseDuration={3000}
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-lg font-medium bg-black hover:bg-gray-800"
          disabled={isLoading}
        >
          {isLoading ? "Importing..." : "Import Recipe"}
        </Button>
      </form>
    </div>
  );
};

export default RecipeImport;