
import api from "./api";
import { format } from "date-fns";
import { toast } from "sonner";

export interface MealPlan {
  id: number;
  date: string;
  meal_type: string;
  recipe_id: number;
  recipe_title?: string;
}

export interface MealPlanCreate {
  date: string;
  meal_type: string;
  recipe_id: number;
}

export const createMealPlan = async (mealPlan: MealPlanCreate) => {
  try {
    const response = await api.post("/meal-plans", mealPlan);
    toast.success("Meal added to plan");
    return response.data;
  } catch (error) {
    console.error("Error creating meal plan:", error);
    throw error;
  }
};

export const getMealPlans = async (startDate: Date, endDate: Date) => {
  try {
    const formattedStartDate = format(startDate, "yyyy-MM-dd");
    const formattedEndDate = format(endDate, "yyyy-MM-dd");
    const response = await api.get(`/meal-plans`, {
      params: {
        start_date: formattedStartDate,
        end_date: formattedEndDate,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching meal plans:", error);
    throw error;
  }
};

export const deleteMealPlan = async (id: number) => {
  try {
    await api.delete(`/meal-plans/${id}`);
    toast.success("Meal removed from plan");
    return true;
  } catch (error) {
    console.error("Error deleting meal plan:", error);
    throw error;
  }
};
