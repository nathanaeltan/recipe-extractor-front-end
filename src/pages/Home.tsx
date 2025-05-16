import { useEffect, useState } from "react";
import RecipeImport from "@/components/RecipeImport";
import { getUserRecipes, Recipe } from "@/services/recipe";
import RecipeCard from "@/components/RecipeCard";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Info, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import { useIsMobile } from "@/hooks/use-mobile";

const Home = () => {
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [infoOpen, setInfoOpen] = useState(false);
  const [supportedSites, setSupportedSites] = useState<string[]>([]);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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
  const fetchSupportedSites = async () => {
    try {
      const { data } = await api.get("/supported-sites");
      setSupportedSites(data);
    } catch (error) {
      console.error("Error fetching supported sites:", error);
      setSupportedSites([]);
    }
  };
  useEffect(() => {
    fetchRecipes();
    fetchSupportedSites()
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
      <div className="relative z-10 w-full mx-auto pb-20 px-4 sm:px-6 md:max-w-3xl lg:max-w-5xl xl:max-w-6xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">DishCover</h1>
            <button
              className="rounded-full p-2 hover:bg-white/30 transition-colors"
              onClick={() => setInfoOpen(true)}
            >
              <span className="sr-only">Info</span>
              <Info className="h-6 w-6" />
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
              <div className={`grid gap-4 ${isMobile ? "" : "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
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
      {/* Info Dialog */}
      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>About DishCover</DialogTitle>
            <DialogDescription>
              DishCover helps you save and organize your favorite recipes from around the web.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Supported Recipe Websites</h3>
              <p className="text-sm text-muted-foreground">
                DishCover currently supports the following websites for automatic recipe importing:
              </p>

              {supportedSites.length > 0 ? (
                <div className="max-h-40 overflow-y-auto text-sm grid grid-cols-2 gap-x-4 gap-y-1 p-2 bg-slate-50 rounded-md">
                  {supportedSites.map((site) => (
                    <div key={site} className="text-xs py-1">{site}</div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">Loading supported sites...</p>
              )}

              <div className="mt-4 p-4 bg-amber-50 rounded-md border border-amber-200">
                <h4 className="font-medium text-sm flex items-center">
                  <span className="mr-2">✨</span>
                  Premium Feature
                </h4>
                <p className="text-sm mt-1">
                  Extraction of recipes from youtube video descriptions are supported for premium users only.
                </p>
                <div className="mt-3">
                  <Button variant="outline" size="sm" className="text-xs flex items-center">
                    <Mail className="mr-2 h-3 w-3" />
                    <a href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL || 'contact@dishcover.com'}`}>Contact for Premium Access</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;