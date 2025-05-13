import { Recipe } from "@/services/recipe";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
}

const RecipeCard = ({ recipe, onClick }: RecipeCardProps) => {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
      onClick={onClick}
    >
      {recipe.image_url && (
        <div className="w-full h-48 overflow-hidden">
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
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-2">{recipe.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">
          {recipe.ingredients.length} ingredients • {recipe.instructions.length} steps
        </p>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;