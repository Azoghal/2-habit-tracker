import { ICategoryProps } from "@/components/Category";
import { CheckboxStateFromInt, ICheckboxProps } from "@/components/Checkbox";
import { IRowProps } from "@/components/Row";
import Table, { ITableProps } from "@/components/Table";
import { Convert, IActivity, ICategory, IHabit, IHabits } from "@/types/habits";
import { useCallback, useEffect, useState } from "react";

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
  const yesterday = today - daySeconds; // TODO remove eventually, just for hardcoding
  const tomorrow = today + daySeconds;

  // TODO for now, use the range yesterday -> tomorrow as the range to fill in, if there is nothing present.

  const [stagedData, setStagedData] = useState(props.data);

  const [currentDate, setCurrentDate] = useState(getTodayMidday());
  const [lockPast, setLockPast] = useState(true);
  const [lockFuture, setLockFuture] = useState(true);

  /// propifies everything - that is present. Missing dates should be generated using fillDates
  const enrichHabits = useCallback(() => {
    const categories: ICategoryProps[] = stagedData.categories.map((c) => {
      const habits: IRowProps[] = c.habits.map((h) => {
        const activities: ICheckboxProps[] = h.activities.map((a) => {
          const activity: ICheckboxProps = {
            ...a,
            state: CheckboxStateFromInt(a.value),
            // locked: false,
            locked:
              (a.date < today && lockPast) || (a.date > today && lockFuture),
            onClick: () => {},
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
      title: stagedData.title,
      categories: categories,
    };
    return res;
  }, [stagedData, lockPast, lockFuture, today]);

  const [habits, setHabits] = useState<ITableProps>(enrichHabits());

  const loadData = useCallback(() => {
    // TODO get the jsonData from cookie
    setHabits(enrichHabits());
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

  // see if we can jsonify ITableProps directly
  const testThinger = useCallback(() => {
    console.log("I'm going to jsonify ITableProps");
    if (habits == undefined) {
      console.log("no habits");
      return;
    }
    const b = Convert.habitsToJson(backToHabits(habits));

    console.log(b);
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
      <button onClick={testThinger}>Press me</button>
      {/* <Row title={"Code"} values={[...allValues.values()]} onUpdateCheckbox={updateAValue} currentDay={today} lockPast={lockPast} lockFuture={lockFuture}/> */}
      {habits && <Table {...habits} />}
    </>
  );
}

// yuck
// start and end are date numbers
// TODO add a type alias for date numbers
function fillBlanks(
  row: IRowProps,
  today: number,
  backwards: number,
  forwards: number,
): IRowProps {
  const createEmpty: (date: number) => ICheckboxProps = (date: number) => {
    return {
      date: date,
      value: 0,
      state: CheckboxStateFromInt(0),
      locked: date != today, // TODO
      onClick: () => {},
    };
  };

  // build the list of activities we need, by creating empty ones when it does not already exist, copying where it does.

  const newActivities: ICheckboxProps[] = [];

  const start = today - backwards * daySeconds;
  const end = today + forwards * daySeconds;

  for (let d = start; d <= end; d += daySeconds) {
    const existing = row.activities.find((c: ICheckboxProps) => {
      return c.date == d;
    });
    if (existing) {
      newActivities.push(existing);
    } else {
      newActivities.push(createEmpty(d));
    }
  }

  return {
    ...row,
    activities: newActivities,
  };
}

function backToHabits(table: ITableProps): IHabits {
  const categories: ICategory[] = table.categories.map((c) => {
    const habits: IHabit[] = c.habits.map((h) => {
      const activities: IActivity[] = h.activities.map((a) => {
        const activity: IActivity = {
          date: a.date,
          value: a.value,
        };
        return activity;
      });
      const row: IHabit = { title: h.title, activities: activities };
      return row;
    });
    const category: ICategory = { title: c.title, habits: habits };
    return category;
  });

  const res: IHabits = {
    title: table.title,
    categories: categories,
  };
  return res;
}
