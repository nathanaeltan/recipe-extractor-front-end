import { useState, useEffect } from "react";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  parseISO,
  isSameDay,
} from "date-fns";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { getUserRecipes, Recipe } from "@/services/recipe";
import {
  getMealPlans,
  createMealPlan,
  deleteMealPlan,
  MealPlan,
} from "@/services/mealPlan";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];

const MealPlanner = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);
  const [isLoadingMealPlans, setIsLoadingMealPlans] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<number | null>(null);
  const [selectedMealType, setSelectedMealType] = useState(mealTypes[0]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const navigate = useNavigate();

  const weekStart = useMemo(
    () => startOfWeek(currentDate, { weekStartsOn: 1 }),
    [currentDate]
  );
  const weekEnd = useMemo(
    () => endOfWeek(currentDate, { weekStartsOn: 1 }),
    [currentDate]
  );

  // Generate array of dates for the week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return {
      date,
      day: format(date, "EEE"),
      dayNumber: format(date, "d"),
    };
  });

  const currentDayIndex = weekDays.findIndex(
    (day) =>
      format(day.date, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd")
  );

  const handleRecipeClick = (id: number) => {
    navigate(`/recipes/${id}`);
  };
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getUserRecipes();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setIsLoadingRecipes(false);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    const fetchMealPlans = async () => {
      setIsLoadingMealPlans(true);
      try {
        const data = await getMealPlans(weekStart, weekEnd);

        // Enrich meal plans with recipe titles
        const enrichedMealPlans = await Promise.all(
          data.map(async (mealPlan: MealPlan) => {
            const recipe = recipes.find((r) => r.id === mealPlan.recipe_id);
            return {
              ...mealPlan,
              recipe_title: recipe?.title || "Unknown Recipe",
            };
          })
        );

        setMealPlans(enrichedMealPlans);
      } catch (error) {
        console.error("Error fetching meal plans:", error);
      } finally {
        setIsLoadingMealPlans(false);
      }
    };

    if (recipes.length > 0) {
      fetchMealPlans();
    }
  }, [recipes, weekStart, weekEnd, currentDate]);

  const handleAddMealPlan = async () => {
    if (!selectedRecipe) return;

    try {
      const newMealPlan = {
        date: format(currentDate, "yyyy-MM-dd"),
        meal_type: selectedMealType.toLowerCase(),
        recipe_id: selectedRecipe,
      };

      await createMealPlan(newMealPlan);

      // Refetch meal plans
      const data = await getMealPlans(weekStart, weekEnd);
      const enrichedMealPlans = data.map((mealPlan: MealPlan) => {
        const recipe = recipes.find((r) => r.id === mealPlan.recipe_id);
        return {
          ...mealPlan,
          recipe_title: recipe?.title || "Unknown Recipe",
        };
      });

      setMealPlans(enrichedMealPlans);
      setAddDialogOpen(false);
      setSelectedRecipe(null);
    } catch (error) {
      console.error("Error adding meal plan:", error);
    }
  };

  const handleDeleteMealPlan = async (id: number) => {
    try {
      await deleteMealPlan(id);
      setMealPlans(mealPlans.filter((plan) => plan.id !== id));
    } catch (error) {
      console.error("Error deleting meal plan:", error);
    }
  };

  const getMealsForCurrentDay = (mealType: string) => {
    return mealPlans.filter(
      (plan) =>
        isSameDay(parseISO(plan.date), currentDate) &&
        plan.meal_type === mealType.toLowerCase()
    );
  };

  const handleCalendarDateSelect = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(date);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-orange-100">
      <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1495195134817-aeb325a55b65?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1776&q=80')] bg-cover bg-center"></div>
      <div className="relative z-10 w-full mx-auto pb-20 px-4 sm:px-6 md:max-w-3xl lg:max-w-5xl xl:max-w-7xl">
        <div className="p-6">
          <div className="backdrop-blur-sm bg-white/90 p-6 shadow-lg rounded-xl">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Meal Planner</h1>
              <div className="flex items-center">
                <span className="mr-2 text-lg">{format(currentDate, "MMMM yyyy")}</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <CalendarIcon className="h-5 w-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={currentDate}
                      onSelect={handleCalendarDateSelect}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex justify-between mb-6 overflow-x-auto pb-2 gap-2">
              {weekDays.map((day, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentDate(day.date)}
                  className={`flex flex-col items-center justify-center min-w-14 sm:min-w-20 lg:min-w-24 h-14 rounded-lg ${
                    index === currentDayIndex
                      ? "bg-primary text-primary-foreground"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  <span className="text-xs">{day.day}</span>
                  <span className="text-lg font-bold">{day.dayNumber}</span>
                </button>
              ))}
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{format(currentDate, "EEEE, MMMM d")}</h2>
              </div>

              <Tabs defaultValue={mealTypes[0].toLowerCase()} className="w-full">
              <TabsList className="w-full mb-4 grid grid-cols-4">
              {mealTypes.map((type) => (
                    <TabsTrigger
                      key={type}
                      value={type.toLowerCase()}
                    >
                      {type}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {mealTypes.map((mealType) => (
                  <TabsContent key={mealType} value={mealType.toLowerCase()}>
                    {isLoadingMealPlans ? (
                      <div className="space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4">
                          {getMealsForCurrentDay(mealType).map((meal) => {
                            const recipe = recipes.find(r => r.id === meal.recipe_id);
                            return (
                              <Card key={meal.id} className="cursor-pointer overflow-hidden border-0 shadow-sm" onClick={() => handleRecipeClick(recipe?.id || 0)}>
                                <div className="flex">
                                  {recipe?.image_url && (
                                    <div className="w-1/3 sm:w-1/4">
                                      <AspectRatio ratio={1/1}>
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
                                  <CardContent className={`${recipe?.image_url ? 'w-2/3 sm:w-3/4' : 'w-full'} p-4 flex justify-between items-center`}>
                                  <div>
                                      <h3 className="font-medium">{meal.recipe_title}</h3>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteMealPlan(meal.id);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4 text-gray-500" />
                                    </Button>
                                  </CardContent>
                                </div>
                              </Card>
                            );
                          })}

                          {getMealsForCurrentDay(mealType).length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              No meals planned for {mealType.toLowerCase()}
                            </div>
                          )}

                          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                            <DialogTrigger asChild>
                              {getMealsForCurrentDay(mealType).length === 0 && (
                                  <Button
                                  variant="outline"
                                  className="w-full mt-4 border-dashed"
                                  onClick={() => setSelectedMealType(mealType)}
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Add {mealType}
                                </Button>
                              ) }

                            </DialogTrigger>
                            <DialogContent className="backdrop-blur-sm bg-white/95 max-w-md w-full">
                              <DialogHeader>
                                <DialogTitle>Add {selectedMealType} for {format(currentDate, "EEEE, MMMM d")}</DialogTitle>
                              </DialogHeader>

                              <div className="py-4">
                                <div className="mb-4">
                                  <label className="text-sm font-medium mb-1 block">
                                    Select Recipe
                                  </label>
                                  <Select
                                    value={selectedRecipe?.toString() || ""}
                                    onValueChange={(value) => setSelectedRecipe(parseInt(value))}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Choose a recipe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <ScrollArea className="h-72">
                                        {isLoadingRecipes ? (
                                          <div className="p-2">Loading recipes...</div>
                                        ) : recipes.length > 0 ? (
                                          recipes.map((recipe) => (
                                            <SelectItem
                                              key={recipe.id}
                                              value={recipe.id?.toString() || ""}
                                            >
                                              {recipe.title}
                                            </SelectItem>
                                          ))
                                        ) : (
                                          <div className="p-2 text-gray-500">
                                            No recipes available. Add recipes first.
                                          </div>
                                        )}
                                      </ScrollArea>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              <DialogFooter>
                                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleAddMealPlan}
                                  disabled={!selectedRecipe}
                                >
                                  Add to Plan
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    </div>
  );
};



export default MealPlanner;
