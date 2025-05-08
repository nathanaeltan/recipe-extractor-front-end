
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

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getUserRecipes();
        // Get most recent 3 recipes
        setRecentRecipes(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleRecipeClick = (id: number) => {
    navigate(`/recipes/${id}`);
  };

  return (
    <div className="max-w-md mx-auto pb-20">
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

        <div className="mb-10">
          <RecipeImport />
        </div>

        <div className="space-y-4">
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
  );
};

export default Home;