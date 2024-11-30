// To parse this data:
//
//   import { Convert, Habits } from "./file";
//
//   const habits = Convert.toHabits(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface IHabits {
    title: string;
    categories: ICategory[];
}

export interface ICategory {
    title: string;
    habits: IHabit[];
}

export interface IHabit {
    title: string;
    activities: IActivity[];
}

export interface IActivity {
    date: number;
    value: number;
}

export function filterZeroActivities(habits: IHabits): IHabits {
    const filteredHabits = { ...habits }; // Create a shallow copy to avoid mutating the original object

    filteredHabits.categories = filteredHabits.categories.map((category) => ({
        ...category,
        habits: category.habits.map((habit) => ({
            ...habit,
            activities: habit.activities.filter(
                (activity) => activity.value !== 0,
            ),
        })),
    }));

    return filteredHabits;
}
