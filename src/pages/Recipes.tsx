
import RecipeList from "@/components/RecipeList";
import BottomNav from "@/components/BottomNav";

const Recipes = () => {
  return (
    <div className="max-w-md mx-auto pb-20">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">My Recipes</h1>
        <RecipeList />
      </div>
      <BottomNav />
    </div>
  );
};

export default Recipes;
