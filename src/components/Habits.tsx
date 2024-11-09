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

function getTodayMidday() {
  const now = new Date();
  now.setUTCHours(12, 0, 0, 0);
  return Math.floor(now.getTime() / 1000);
}

export interface IHabitsProps {
  data: IHabits; // TODO use maps in the types - it's the right data type. would be ideal if the parser generator could do us maps, have a go
  updateHabits(newHabits: IHabits): void;
}

const daySeconds = 86400;

export default function Habits(props: IHabitsProps) {
  const today = getTodayMidday();

  // TODO rationalise the whole thing
  // 1. Populate the object to have all the relevant dates
  // 2. Convert them to suitable for props with enrich

  const [rawHabits, setRawHabits] = useState<IHabits>(props.data);
  const [mappedHabits, setMappedHabits] = useState<IHabitsMapped>(
    mapifyHabits(props.data)
  );

  const updateABox = useCallback(
    (category: string, habit: string, date: number, value: number) => {
      setMappedHabits((old) => {
        if (!old) return old;

        const newMappedHabits = { ...old };
        const newCategory = newMappedHabits.categories.get(category) || {
          habits: new Map(),
        };
        const newHabit = newCategory.habits.get(habit) || {
          activities: new Map(),
        };

        const cappedValue = value;
        if (value > 2) {
          value = 1;
        }

        newHabit.activities.set(date, cappedValue);
        newCategory.habits.set(habit, newHabit);
        newMappedHabits.categories.set(category, newCategory);

        console.log("newMapped", newMappedHabits);
        return newMappedHabits;
      });
    },
    [setMappedHabits]
  );

  useEffect(() => {
    const unmapped = unmapifyHabits(mappedHabits);
    console.log("unmapped", unmapped);
    setRawHabits(unmapped);
  }, [mappedHabits, setRawHabits]);

  const [currentDate, setCurrentDate] = useState(getTodayMidday());
  const [lockPast, setLockPast] = useState(true);
  const [lockFuture, setLockFuture] = useState(true);

  /// propifies everything - that is present. Missing dates should be generated using fillDates
  const enrichedHabits = useMemo(() => {
    const categories: ICategoryProps[] = rawHabits.categories.map((c) => {
      const habits: IRowProps[] = c.habits.map((h) => {
        const activities: ICheckboxProps[] = h.activities.map((a) => {
          const activity: ICheckboxProps = {
            ...a,
            state: CheckboxStateFromInt(a.value),
            // locked: false,
            locked:
              (a.date < today && lockPast) || (a.date > today && lockFuture),
            onClick: () => {
              console.log("onClick", h.title, a.date);
              updateABox(c.title, h.title, a.date, a.value + 1);
            },
          };
          return activity;
        });
        let row: IRowProps = { title: h.title, activities: activities };
        row = fillBlanks(row, today, 5, 5);
        return row;
      });
      const category: ICategoryProps = { title: c.title, habits: habits };
      return category;
    });

    const res: ITableProps = {
      title: rawHabits.title,
      categories: categories,
    };
    return res;
  }, [rawHabits, lockPast, lockFuture, today, updateABox]);

  const [habits, setHabits] = useState<ITableProps>(enrichedHabits);

  const loadData = useCallback(() => {
    // TODO get the jsonData from cookie
    setHabits(enrichedHabits);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const toggleLockPast = useCallback(() => {
    setLockPast((prev) => !prev);
  }, [lockPast]);

  const toggleLockFuture = useCallback(() => {
    setLockFuture((prev) => !prev);
  }, [lockPast]);

  useEffect(() => {
    // TODO on load, we should check if cookie exists. If it does, pull from there, otherwise, initialise empty
    loadData();
  }, []);

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
      {habits && <Table {...habits} />}
    </>
  );
}

// fill blanks puts 0 values in the map between certain dates, if no record exists
export function fillBlanks(
  row: IHabitMapped,
  today: number,
  backwards: number,
  forwards: number
): IHabitMapped {
  // build the list of activities we need, by creating empty ones when it does not already exist, copying where it does.

  const start = today - backwards * daySeconds;
  const end = today + forwards * daySeconds;
  for (let d = start; d <= end; d += daySeconds) {
    if (row.activities.get(d) == undefined) {
      row.activities.set(d, 0);
      // TODO need row =?
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
