import { IActivity, ICategory, IHabit, IHabits } from "./habits";

export interface IHabitsMapped {
  categories: Map<string, ICategoryMapped>;
}

export interface ICategoryMapped {
  habits: Map<string, IHabitMapped>;
}

// maps date to state 0,1,2
export interface IHabitMapped {
  activities: Map<number, number>;
}

export function mapifyHabits(inHabits: IHabits): IHabitsMapped {
  const mappedHabits: IHabitsMapped = {
    categories: new Map(),
  };

  inHabits.categories.forEach((category) => {
    const mappedCategory: ICategoryMapped = {
      habits: new Map(),
    };

    mappedHabits.categories.set(category.title, mappedCategory);

    category.habits.forEach((habit) => {
      const mappedHabit: IHabitMapped = {
        activities: new Map(),
      };

      mappedCategory.habits.set(habit.title, mappedHabit);

      habit.activities.forEach((activity) => {
        mappedHabit.activities.set(activity.date, activity.value);
      });
    });
  });

  return mappedHabits;
}

export function unmapifyHabits(inHabits: IHabitsMapped): IHabits {
  const habits: IHabits = {
    title: "", // You might want to provide a default title or extract it from the mapped data
    categories: [],
  };

  inHabits.categories.forEach((category, categoryTitle) => {
    const categoryObj: ICategory = {
      title: categoryTitle,
      habits: [],
    };
    habits.categories.push(categoryObj);

    category.habits.forEach((habit, habitTitle) => {
      const habitObj: IHabit = {
        title: habitTitle,
        activities: [],
      };
      categoryObj.habits.push(habitObj);

      habit.activities.forEach((activity, date) => {
        const activityObj: IActivity = {
          date: Number(date),
          value: activity,
        };
        habitObj.activities.push(activityObj);
      });
    });
  });

  return habits;
}
