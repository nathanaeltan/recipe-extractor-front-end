import { useEffect, useState } from "react";
import RecipeImport from "@/components/RecipeImport";
import { getUserRecipes, Recipe } from "@/services/recipe";
import RecipeCard from "@/components/RecipeCard";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const Home = () => {
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRecipes = async () => {
    try {
      setIsLoading(true);
      const data = await getUserRecipes();
      // Get most recent 3 recipes
      setRecentRecipes(data.slice(0, 3));
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleRecipeClick = (id: number) => {
    navigate(`/recipes/${id}`);
  };

  const handleRecipeDelete = () => {
    // Refresh the recipe list after deletion
    fetchRecipes();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-orange-100">
      <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1495195134817-aeb325a55b65?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1776&q=80')] bg-cover bg-center"></div>
      <div className="relative z-10 max-w-md mx-auto pb-20">
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Recipe Saver</h1>
            <button className="rounded-full p-2">
              <span className="sr-only">Info</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </button>
          </div>

          <div className="mb-10 backdrop-blur-sm bg-white/90 shadow-lg rounded-xl">
            <RecipeImport />
          </div>

          <div className="space-y-4 backdrop-blur-sm bg-white/90 p-6 shadow-lg rounded-xl">
            <h2 className="text-2xl font-bold">Recent Recipes</h2>

            {isLoading ? (
              <div className="text-center py-6">Loading recipes...</div>
            ) : recentRecipes.length > 0 ? (
              <div className="space-y-4">
                {recentRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onClick={() => recipe.id && handleRecipeClick(recipe.id)}
                    onDelete={handleRecipeDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No recipes yet. Import your first recipe above!
              </div>
            )}
          </div>
        </div>
        <BottomNav />
      </div>
    </div>
  );
};

export default Home;