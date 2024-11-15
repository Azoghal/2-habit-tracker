import { ICategoryProps } from "@/components/Category";
import { CheckboxStateFromInt, ICheckboxProps } from "@/components/Checkbox";
import { IRowProps } from "@/components/Row";
import Table from "@/components/Table";
import { Convert, filterZeroActivities, IHabits } from "@/types/habits";
import {
  fillAll,
  ICategoryMapped,
  IHabitMapped,
  IHabitsMapped,
  mapifyHabits,
  unmapifyHabits,
} from "@/types/habitsMaps";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCookies } from "react-cookie";

export function getTodayMidday() {
  const now = new Date();
  now.setUTCHours(12, 0, 0, 0);
  return Math.floor(now.getTime() / 1000);
}

export interface IHabitsProps {
  data: IHabits; // TODO use maps in the types - it's the right data type. would be ideal if the parser generator could do us maps, have a go
}

export const DAY_SECONDS = 86400;
export const YEAR_MILLIS = 365 * DAY_SECONDS * 1000;

export default function Habits(props: IHabitsProps) {
  const [cookie, setCookie] = useCookies(["habitsCookie"]);

  const today = getTodayMidday();
  const [lockPast, setLockPast] = useState(false);
  const [lockFuture, setLockFuture] = useState(false);

  const [mappedHabits, setMappedHabits] = useState<IHabitsMapped>(
    fillAll(mapifyHabits(props.data), today, 5, 5)
  );

  const updateHabitCookie = useCallback(
    (newMappedHabits: IHabits) => {
      setCookie("habitsCookie", Convert.habitsToJson(newMappedHabits), {
        path: "/",
        expires: new Date(Date.now() + YEAR_MILLIS),
      });
    },
    [setCookie]
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
      console.log("called updateMappedHabitsCallback");
      setMappedHabits((old) => {
        const newHabits = { ...old };
        // TODO undo !
        const c: ICategoryMapped = newHabits.categories.get(category)!;
        const h: IHabitMapped = c.habits.get(habit)!;
        const nh = h.activities.set(date, newValue);
        updateHabitCookie(filterZeroActivities(unmapifyHabits(newHabits)));
        return old;
      });
    },
    [setMappedHabits, lockPast, lockFuture, updateHabitCookie]
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
        updateHabitCookie(filterZeroActivities(unmapifyHabits(updated)));
        return updated;
      });
      loadData();
    },
    [updateHabitCookie, loadData, setMappedHabits]
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
        updateHabitCookie(filterZeroActivities(unmapifyHabits(updated)));
        return updated;
      });
      loadData();
    },
    [props.data, updateHabitCookie, loadData]
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
                  `I have been pressed (${categoryName}, ${habitName}, ${date}, ${activity}=>${(activity + 1) % 3})`
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
  }, [mappedHabits, lockFuture, lockPast, props.data, updateMappedHabits]);
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
      {/* <Row title={"Code"} values={[...allValues.values()]} onUpdateCheckbox={updateAValue} currentDay={today} lockPast={lockPast} lockFuture={lockFuture}/> */}
      {tableHabits && <Table {...tableHabits} addCategory={addCategory} />}
    </>
  );
}
