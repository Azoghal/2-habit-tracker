import { ICategoryProps } from "@/components/Category";
import { CheckboxStateFromInt, ICheckboxProps } from "@/components/Checkbox";
import { IRowProps } from "@/components/Row";
import Table, { ITableProps } from "@/components/Table";
import { IHabits } from "@/types/habits";
import {
  fillAll,
  ICategoryMapped,
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

export const DAY_SECONDS = 86400;

// TODO rationalise the whole thing
// 1. Populate the object to have all the relevant dates
// 2. Convert them to suitable for props with enrich

export default function Habits(props: IHabitsProps) {
  const today = getTodayMidday();
  const [lockPast, setLockPast] = useState(true);
  const [lockFuture, setLockFuture] = useState(true);

  const [mappedHabits, setMappedHabits] = useState<IHabitsMapped>(
    fillAll(mapifyHabits(props.data), today, 5, 5)
  );

  const [tableHabits, setTableHabits] = useState<ITableProps>();

  useEffect(() => {
    console.log("mappedHabits changed");
  }, [mappedHabits]);

  const loadData = useCallback(() => {
    setMappedHabits(fillAll(mapifyHabits(props.data), today, 5, 5));
    updateTableHabits();
  }, [setMappedHabits, props.data]);

  useEffect(() => {
    loadData();
  }, []);

  const updateMappedHabits = useCallback(
    (category: string, habit: string, date: number, newValue: number) => {
      console.log("updating mappedHabits");
      setMappedHabits((old) => {
        const newHabits = old;
        const c: ICategoryMapped = newHabits.categories.get(category)!;
        const h: IHabitMapped = c.habits.get(habit)!;
        const nh = h.activities.set(date, newValue);
        console.log("the new habits", newHabits);
        setTableHabits(mapHabitsToTableProps(newHabits));
        props.updateHabits(unmapifyHabits(newHabits));
        return old;
      });
    },
    [setMappedHabits]
  );

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
                  updateMappedHabits(
                    categoryName,
                    habitName,
                    date,
                    (activity + 1) % 3
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
    [lockFuture, lockPast, updateMappedHabits]
  );

  const updateTableHabits = useCallback(() => {
    console.log("recalculating tableHabits");
    setTableHabits(mapHabitsToTableProps(mappedHabits));
  }, [mapHabitsToTableProps, mappedHabits]);

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
      <button
        onClick={() => {
          console.log("sending this through as cookie", mappedHabits);
        }}
      >
        trigger update cookie
      </button>
      {/* <Row title={"Code"} values={[...allValues.values()]} onUpdateCheckbox={updateAValue} currentDay={today} lockPast={lockPast} lockFuture={lockFuture}/> */}
      {tableHabits && <Table {...tableHabits} />}
    </>
  );
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
