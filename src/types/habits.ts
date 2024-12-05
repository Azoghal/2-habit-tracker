// To parse this data:
//
//   import { Convert, Habits } from "./file";
//
//   const habits = Convert.toHabits(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

import { DAY_SECONDS } from "../components/Habits";

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

export function fillAll(
    habits: IHabits,
    today: number,
    backwards: number,
    forwards: number,
): IHabits {
    let newCategories: ICategory[] = [];
    for (const category of habits.categories) {
        let newHabits: IHabit[] = [];
        for (const habit of category.habits) {
            const newHabit = fillBlanks(habit, today, backwards, forwards);
            newHabits = newHabits.concat(newHabit);
        }
        newCategories = newCategories.concat({
            ...category,
            habits: newHabits,
        });
    }
    habits.categories = newCategories;

    return habits;
}

// fill blanks puts 0 values in the map between certain dates, if no record exists
export function fillBlanks(
    row: IHabit,
    today: number,
    backwards: number,
    forwards: number,
): IHabit {
    const start = today - backwards * DAY_SECONDS;
    const end = today + forwards * DAY_SECONDS;

    const beforeDates = row.activities.map((a) => {
        return a.date;
    });

    console.log("before activites dates", beforeDates);

    console.log("expected length at end:", backwards + forwards + 1);

    const middays: number[] = [];
    for (let t = start; t <= end; t += DAY_SECONDS) {
        const middayTimestamp = t;
        middays.push(middayTimestamp);
    }

    console.log("length of middays we calculated", middays.length);

    const toAdd = middays
        .filter((d) => {
            return !beforeDates.includes(d);
        })
        .map((d) => {
            const bob: IActivity = {
                date: d,
                value: 0,
            };
            return bob;
        });

    console.log("things to add (", toAdd.length, ")", toAdd);

    const filledActivities = row.activities.concat(toAdd).sort((a, b) => {
        return a.date - b.date;
    });

    return { ...row, activities: filledActivities };
}
