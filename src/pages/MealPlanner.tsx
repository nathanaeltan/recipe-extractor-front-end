import { useState } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";

const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];

const MealPlanner = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });

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
    (day) => format(day.date, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd")
  );

  return (
    <div className="max-w-md mx-auto pb-20">
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Meal Planner</h1>
          <div className="flex items-center">
            <span className="mr-2 text-lg">{format(currentDate, "MMMM yyyy")}</span>
            <Button variant="ghost" size="icon">
              <CalendarIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex justify-between mb-4 overflow-x-auto pb-2">
          {weekDays.slice(0, 6).map((day, index) => (
            <button
              key={index}
              onClick={() => setCurrentDate(day.date)}
              className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg ${
                index === currentDayIndex
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <span className="text-xs">{day.day}</span>
              <span className="text-lg font-bold">{day.dayNumber}</span>
            </button>
          ))}
        </div>

        <div className="space-y-6 mt-8">
          {mealTypes.map((meal, index) => (
            <div key={index} className="space-y-2">
              <h2 className="text-xl font-bold">{meal}</h2>
              <button
                className="w-full p-4 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50"
              >
                <span className="mr-2">+</span>
                <span>Add {meal}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default MealPlanner;