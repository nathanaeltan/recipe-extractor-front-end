import { useState } from "react";
import { extractRecipe, saveRecipe } from "@/services/recipe";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import TypingPlaceholder from "./TypingPlaceholder";
import { Progress } from "@/components/ui/progress";
import { Loader } from "lucide-react";

const RecipeImport = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState("");
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

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

    setProgress(0);

    // Start progress animation
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        // Increment progress but cap at 90% until complete
        const newProgress = prevProgress + Math.random() * 10;
        return newProgress > 90 ? 90 : newProgress;
      });
    }, 500);

    try {
      // Extract recipe from URL
      toast.info("Extracting recipe...");
      const extractedRecipe = await extractRecipe({ url });

      // Update progress
      setProgress(95);

      // Save recipe to database
      toast.info("Saving recipe...");
      await saveRecipe(extractedRecipe);

      // Complete progress
      setProgress(100);
      toast.success("Recipe imported successfully!");

      // Reset form and redirect
      setUrl("");
      navigate("/recipes");
    } catch (error) {
      console.error("Recipe import failed:", error);
      toast.error("Failed to import recipe. Please try again.");
    } finally {
      clearInterval(progressInterval);
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
            disabled={isLoading}
          />
          <TypingPlaceholder
            suggestions={placeholderSuggestions}
            onPlaceholderChange={setPlaceholder}
            typingSpeed={80}
            deletingSpeed={30}
            pauseDuration={3000}
          />
        </div>

        {isLoading && (
          <div className="space-y-3 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Importing recipe...</span>
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-12 text-lg font-medium bg-black hover:bg-gray-800 relative"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <Loader className="mr-2 h-5 w-5 animate-spin" />
              Importing...
            </span>
          ) : (
            "Import Recipe"
          )}
        </Button>
      </form>
    </div>
  );
};

export default RecipeImport;