import { ICategoryProps } from "@/components/Category";
import { CheckboxStateFromInt, ICheckboxProps } from "@/components/Checkbox";
import { IRowProps } from "@/components/Row";
import Table, { ITableProps } from "@/components/Table";
import {
  filterZeroActivities,
  ICategory,
  IHabit,
  IHabits,
} from "@/types/habits";
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

  // useEffect(() => {
  //   setMappedHabits(fillAll(mapifyHabits(props.data), today, 5, 5));
  // }, [setMappedHabits, props.data]);

  const loadData = useCallback(() => {
    setMappedHabits(fillAll(mapifyHabits(props.data), today, 5, 5));
  }, [setMappedHabits, props.data]);

  useEffect(() => {
    loadData();
  }, [props.data]);

  const updateMappedHabits = useCallback(
    (category: string, habit: string, date: number, newValue: number) => {
      console.log("updating mappedHabits");
      setMappedHabits((old) => {
        const newHabits = { ...old };
        // TODO undo !
        const c: ICategoryMapped = newHabits.categories.get(category)!;
        const h: IHabitMapped = c.habits.get(habit)!;
        const nh = h.activities.set(date, newValue);
        console.log("the new habits", newHabits);
        props.updateHabits(filterZeroActivities(unmapifyHabits(newHabits)));
        return old;
      });
    },
    [setMappedHabits, lockPast, lockFuture]
  );

  const addCategory = useCallback(
    (categoryName: string) => {
      console.log("adding new category", categoryName);
      setMappedHabits((old) => {
        const updated: IHabitsMapped = { ...old };
        // TODO check that it doesn't already exist
        const newCategory: ICategoryMapped = {
          habits: new Map(),
        };
        updated.categories.set(categoryName, newCategory);
        props.updateHabits(filterZeroActivities(unmapifyHabits(updated)));
        return updated;
      });
      loadData();
    },
    [props.updateHabits, loadData, setMappedHabits]
  );

  // TODO I think addHabit and addCategory should operate on the mapped guys
  const addHabit = useCallback(
    (categoryName: string, habitName: string) => {
      console.log("adding new habit", categoryName, habitName);
      setMappedHabits((old) => {
        const updated: IHabitsMapped = { ...old };
        const category = updated.categories.get(categoryName)!;
        if (!category.habits.get(habitName)) {
          const newHabit: IHabitMapped = {
            activities: new Map(),
          };
          category.habits.set(habitName, newHabit);
        }
        props.updateHabits(filterZeroActivities(unmapifyHabits(updated)));
        return updated;
      });
      loadData();
    },
    [props.data, props.updateHabits, loadData]
  );

  // consolidate this and the effect below into a useMemo
  const tableHabits = useMemo(() => {
    const categories = new Map<string, ICategoryProps>();
    for (const [
      categoryName,
      categoryData,
    ] of mappedHabits.categories.entries()) {
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
                  `I been pressed (${categoryName}, ${habitName}, ${date}, ${activity}=>${(activity + 1) % 3})`
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
        addHabit: addHabit,
      });
    }

    return {
      title: "My Habits", // Replace with your desired title
      categories: categories,
    };
  }, [mappedHabits, lockFuture, lockPast, props.data]);
  // TODO slightly hacky to depend on props.data but is necesary as updated map is not triggering rerender

  const toggleLockPast = useCallback(() => {
    setLockPast((prev) => !prev);
  }, [setLockPast]);

  const toggleLockFuture = useCallback(() => {
    setLockFuture((prev) => !prev);
  }, [setLockFuture]);

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
          addCategory("Coding" + Math.random());
        }}
      >
        add new category
      </button>
      {/* <Row title={"Code"} values={[...allValues.values()]} onUpdateCheckbox={updateAValue} currentDay={today} lockPast={lockPast} lockFuture={lockFuture}/> */}
      {tableHabits && <Table {...tableHabits} addCategory={addCategory} />}
    </>
  );
}
