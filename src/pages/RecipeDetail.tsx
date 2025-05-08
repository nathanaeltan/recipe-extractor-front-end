
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserRecipes, Recipe } from "@/services/recipe";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipes = await getUserRecipes();
        const foundRecipe = recipes.find(
          r => r.id === parseInt(id || '0', 10)
        );

        if (foundRecipe) {
          setRecipe(foundRecipe);
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto p-6 pb-20">
        <div className="text-center py-12">Loading recipe...</div>
        <BottomNav />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="max-w-md mx-auto p-6 pb-20">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Recipe not found</h2>
          <Button onClick={() => navigate('/recipes')}>Back to Recipes</Button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto pb-20">
      <div className="p-6">
        <Button
          variant="ghost"
          className="mb-4 p-0"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </Button>

        <h1 className="text-2xl font-bold mb-6">{recipe.title}</h1>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3">Ingredients</h2>
          <ul className="space-y-2 pl-5 list-disc">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="text-gray-700">{ingredient}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3">Instructions</h2>
          <ol className="space-y-4 pl-5 list-decimal">
            {recipe.instructions.map((step, index) => (
              <li key={index} className="text-gray-700">
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default RecipeDetail;