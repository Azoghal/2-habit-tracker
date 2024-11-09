import { ICategoryProps } from "@/components/Category";
import { CheckboxStateFromInt, ICheckboxProps } from "@/components/Checkbox";
import { IRowProps } from "@/components/Row";
import Table, { ITableProps } from "@/components/Table";
import { Convert, IActivity, ICategory, IHabit, IHabits } from "@/types/habits";
import {
  IHabitMapped,
  IHabitsMapped,
  mapifyHabits,
  unmapifyHabits,
} from "@/types/habitsMaps";
import { useCallback, useEffect, useMemo, useState } from "react";

export function getTodayMidday() {
  const now = new Date();
  now.setUTCHours(12, 0, 0, 0);
  return Math.floor(now.getTime() / 1000);
}

export interface IHabitsProps {
  data: IHabits; // TODO use maps in the types - it's the right data type. would be ideal if the parser generator could do us maps, have a go
  updateHabits(newHabits: IHabits): void;
}

const daySeconds = 86400;

// TODO rationalise the whole thing
// 1. Populate the object to have all the relevant dates
// 2. Convert them to suitable for props with enrich

export default function Habits(props: IHabitsProps) {
  const today = getTodayMidday();
  const [lockPast, setLockPast] = useState(true);
  const [lockFuture, setLockFuture] = useState(true);

  const [tableHabits, setTableHabits] = useState<ITableProps>();

  const mapHabitsToTableProps = useCallback(
    (habitsMapped: IHabitsMapped): ITableProps => {
      const categories = new Map<string, ICategoryProps>();
      for (const [
        categoryName,
        categoryData,
      ] of habitsMapped.categories.entries()) {
        const categoryHabits = new Map<string, IRowProps>();
        for (const [habitName, habitData] of categoryData.habits.entries()) {
          const habitActivities = new Map<number, ICheckboxProps>();
          for (const [date, activity] of habitData.activities.entries()) {
            date != undefined &&
              habitActivities.set(date, {
                date: date,
                value: activity,
                state: CheckboxStateFromInt(activity),
                locked:
                  (date < today && lockPast) || (date > today && lockFuture),
                onClick: () => {
                  console.log(
                    `I been pressed (${categoryName}, ${habitName}, ${date})`
                  );
                  // Implement your desired onClick behavior here
                },
              });
          }

          categoryHabits.set(habitName, {
            title: habitName,
            activities: habitActivities,
          });
        }

        categories.set(categoryName, {
          title: categoryName,
          habits: categoryHabits,
        });
      }

      return {
        title: "My Habits", // Replace with your desired title
        categories: categories,
      };
    },
    [lockFuture, lockPast]
  );

  useEffect(() => {
    const mapp = mapifyHabits(props.data);
    const filled = fillAll(mapp, today, 5, 5);
    const propped = mapHabitsToTableProps(filled);
    setTableHabits(propped);
  }, [setTableHabits, mapHabitsToTableProps, props.data]);

  const toggleLockPast = useCallback(() => {
    setLockPast((prev) => !prev);
  }, [lockPast]);

  const toggleLockFuture = useCallback(() => {
    setLockFuture((prev) => !prev);
  }, [lockPast]);

  return (
    <>
      {/* <Checkbox state={checkState} onClick={updateCheck}/> */}
      <button className="" onClick={toggleLockPast}>
        {lockPast ? "🔒" : "🔓"} Past
      </button>
      <button onClick={toggleLockFuture}>
        {lockFuture ? "🔒" : "🔓"} Future
      </button>
      {/* <Row title={"Code"} values={[...allValues.values()]} onUpdateCheckbox={updateAValue} currentDay={today} lockPast={lockPast} lockFuture={lockFuture}/> */}
      {tableHabits && <Table {...tableHabits} />}
    </>
  );
}

function fillAll(
  habits: IHabitsMapped,
  today: number,
  backwards: number,
  forwards: number
): IHabitsMapped {
  // Iterate over each category in the habits map
  for (const [categoryName, category] of habits.categories) {
    // Iterate over each habit in the category
    for (const [habitName, habit] of category.habits) {
      // Fill blanks for the current habit
      const newHabit = fillBlanks(habit, today, backwards, forwards);
      // Update the habit in the category map
      category.habits.set(habitName, newHabit);
    }
    // Update the category in the habits map
    habits.categories.set(categoryName, category);
  }

  return habits;
}

// fill blanks puts 0 values in the map between certain dates, if no record exists
export function fillBlanks(
  row: IHabitMapped,
  today: number,
  backwards: number,
  forwards: number
): IHabitMapped {
  const start = today - backwards * daySeconds;
  const end = today + forwards * daySeconds;
  for (let d = start; d <= end; d += daySeconds) {
    if (row.activities.get(d) == undefined) {
      row.activities.set(d, 0);
    }
  }
  return row;
}

// function backToHabits(table: ITableProps): IHabits {
//   const categories: ICategory[] = table.categories.map((c) => {
//     const habits: IHabit[] = c.habits.map((h) => {
//       const activities: IActivity[] = h.activities.map((a) => {
//         const activity: IActivity = {
//           date: a.date,
//           value: a.value,
//         };
//         return activity;
//       });
//       const row: IHabit = { title: h.title, activities: activities };
//       return row;
//     });
//     const category: ICategory = { title: c.title, habits: habits };
//     return category;
//   });

//   const res: IHabits = {
//     title: table.title,
//     categories: categories,
//   };
//   return res;
// }
