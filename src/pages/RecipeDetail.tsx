import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserRecipes, Recipe } from "@/services/recipe";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-orange-100">
      <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1495195134817-aeb325a55b65?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1776&q=80')] bg-cover bg-center"></div>
      <div className="relative z-10 max-w-md mx-auto pb-20">
        {isLoading ? (
          <div className="p-6">
            <div className="backdrop-blur-sm bg-white/90 p-6 shadow-lg rounded-xl">
              <div className="text-center py-12">Loading recipe...</div>
            </div>
          </div>
        ) : !recipe ? (
          <div className="p-6">
            <div className="backdrop-blur-sm bg-white/90 p-6 shadow-lg rounded-xl">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-2">Recipe not found</h2>
                <Button onClick={() => navigate('/recipes')}>Back to Recipes</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="backdrop-blur-sm bg-white/90 p-6 shadow-lg rounded-xl">
              <Button
                variant="ghost"
                className="mb-4 p-0"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>

              <h1 className="text-2xl font-bold mb-4">{recipe.title}</h1>

              {recipe.image_url && (
                <div className="mb-6 rounded-lg overflow-hidden border border-border">
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={recipe.image_url}
                      alt={recipe.title}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800";
                      }}
                    />
                  </AspectRatio>
                </div>
              )}

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

              {recipe.original_url && (
                <div className="mt-8 pt-4 border-t border-border">
                  <a
                    href={recipe.original_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    View original recipe
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
        <BottomNav />
      </div>
    </div>
  );
};

export default RecipeDetail;