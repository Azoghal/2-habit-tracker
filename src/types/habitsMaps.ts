// // import { DAY_SECONDS } from "@/components/Habits";
// import { IActivity, ICategory, IHabit, IHabits } from "./habits";

// const DAY_SECONDS = 86400;

// export interface IHabitsMapped {
//     categories: Map<string, ICategoryMapped>;
// }

// export interface ICategoryMapped {
//     habits: Map<string, IHabitMapped>;
// }

// // maps date to state 0,1,2
// export interface IHabitMapped {
//     activities: Map<number, number>;
// }

// export function mapifyHabits(inHabits: IHabits): IHabitsMapped {
//     const mappedHabits: IHabitsMapped = {
//         categories: new Map(),
//     };

//     inHabits.categories.forEach((category) => {
//         const mappedCategory: ICategoryMapped = {
//             habits: new Map(),
//         };

//         mappedHabits.categories.set(category.title, mappedCategory);

//         category.habits.forEach((habit) => {
//             const mappedHabit: IHabitMapped = {
//                 activities: new Map(),
//             };

//             mappedCategory.habits.set(habit.title, mappedHabit);

//             habit.activities.forEach((activity) => {
//                 mappedHabit.activities.set(activity.date, activity.value);
//             });
//         });
//     });

//     return mappedHabits;
// }

// export function unmapifyHabits(inHabits: IHabitsMapped): IHabits {
//     const habits: IHabits = {
//         title: "", // You might want to provide a default title or extract it from the mapped data
//         categories: [],
//     };

//     inHabits.categories.forEach((category, categoryTitle) => {
//         const categoryObj: ICategory = {
//             title: categoryTitle,
//             habits: [],
//         };
//         habits.categories.push(categoryObj);

//         category.habits.forEach((habit, habitTitle) => {
//             const habitObj: IHabit = {
//                 title: habitTitle,
//                 activities: [],
//             };
//             categoryObj.habits.push(habitObj);

//             habit.activities.forEach((activity, date) => {
//                 if (activity != undefined && date != undefined) {
//                     const activityObj: IActivity = {
//                         date: Number(date),
//                         value: activity,
//                     };
//                     habitObj.activities.push(activityObj);
//                 }
//             });
//         });
//     });

//     return habits;
// }

// export function fillAll(
//     habits: IHabitsMapped,
//     today: number,
//     backwards: number,
//     forwards: number,
// ): IHabitsMapped {
//     // Iterate over each category in the habits map
//     for (const [categoryName, category] of habits.categories) {
//         // Iterate over each habit in the category
//         for (const [habitName, habit] of category.habits) {
//             // Fill blanks for the current habit
//             const newHabit = fillBlanks(habit, today, backwards, forwards);
//             // Update the habit in the category map
//             category.habits.set(habitName, newHabit);
//         }
//         // Update the category in the habits map
//         habits.categories.set(categoryName, category);
//     }

//     return habits;
// }

// // fill blanks puts 0 values in the map between certain dates, if no record exists
// export function fillBlanks(
//     row: IHabitMapped,
//     today: number,
//     backwards: number,
//     forwards: number,
// ): IHabitMapped {
//     const start = today - backwards * DAY_SECONDS;
//     const end = today + forwards * DAY_SECONDS;
//     for (let d = start; d <= end; d += DAY_SECONDS) {
//         if (row.activities.get(d) == undefined) {
//             row.activities.set(d, 0);
//         }
//     }
//     return row;
// }
