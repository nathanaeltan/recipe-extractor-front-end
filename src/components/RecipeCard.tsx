
import { Recipe, deleteRecipe } from "@/services/recipe";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Heart, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  onDelete?: () => void;
}

const RecipeCard = ({ recipe, onClick, onDelete }: RecipeCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    if (onClick) onClick();
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!recipe.id) return;

    setIsDeleting(true);
    try {
      await deleteRecipe(recipe.id);
      if (onDelete) onDelete();
    } catch (error) {
      console.error("Failed to delete recipe:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Placeholder for future favorite functionality
    toast.info("Favorite feature coming soon!");
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden relative group"
    >
      <div onClick={handleCardClick} className="h-full">
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
      </div>

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
          onClick={handleFavorite}
        >
          <Heart className="h-4 w-4 text-gray-600" />
          <span className="sr-only">Favorite</span>
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
            >
              <Trash2 className="h-4 w-4 text-gray-600" />
              <span className="sr-only">Delete</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{recipe.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
};

export default RecipeCard;