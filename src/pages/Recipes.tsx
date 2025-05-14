
import RecipeList from "@/components/RecipeList";
import BottomNav from "@/components/BottomNav";

const Recipes = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-orange-100">
      <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1495195134817-aeb325a55b65?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1776&q=80')] bg-cover bg-center"></div>
      <div className="relative z-10 max-w-2xl mx-auto pb-20">
        <div className="p-6">
          <div className="backdrop-blur-sm bg-white/90 p-6 shadow-lg rounded-xl">
            <h1 className="text-3xl font-bold mb-8">My Recipes</h1>
            <RecipeList />
          </div>
        </div>
        <BottomNav />
      </div>
    </div>
  );
};

export default Recipes;