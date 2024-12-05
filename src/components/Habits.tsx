import { fillAll, ICategory, IHabit, IHabits } from "../types/habits";
import { useCallback, useMemo, useState } from "react";
import Table, { ITableProps } from "./Table";

export function getTodayMidday() {
    const now = new Date();
    now.setUTCHours(12, 0, 0, 0);
    return Math.floor(now.getTime() / 1000);
}

export interface IHabitsProps {
    data: IHabits;
    updateHabits(newHabits: IHabits): void;
}

export const DAY_SECONDS = 86400;
export const YEAR_MILLIS = 365 * DAY_SECONDS * 1000;

export default function Habits(props: IHabitsProps) {
    const today = getTodayMidday();
    const [lockPast, setLockPast] = useState(false);
    const [lockFuture, setLockFuture] = useState(false);

    // const [habits, setHabits] = useState<IHabits>();

    // const updateHabits = useCallback((newHabits: IHabits) => {
    //      setHabits(newHabits)
    //      props.updateHabits(newHabits)
    // }, [])

    const addCategory = useCallback(
        (categoryName: string) => {
            // TODO set the staged state
            const newCategory: ICategory = {
                title: categoryName,
                habits: [],
            };
            props.updateHabits({
                ...props.data,
                categories: props.data.categories.concat(newCategory),
            });
        },
        [props],
    );

    const addHabit = useCallback(
        (category: string, newHabit: string) => {
            // TODO set the staged state
            const newCategories = props.data.categories.map((c: ICategory) => {
                if (c.title == category) {
                    const habit: IHabit = {
                        title: newHabit,
                        activities: [],
                    };
                    c.habits.push(habit);
                }
                return c;
            });
            props.updateHabits({ ...props.data, categories: newCategories });
        },
        [props],
    );

    const changeValue = useCallback(
        (category: string, habit: string, date: number, newValue: number) => {
            // TODO actually change them
            const newCategories = props.data.categories.map((c: ICategory) => {
                if (c.title == category) {
                    const newHabits = c.habits.map((h: IHabit) => {
                        if (h.title == habit) {
                            const newActivities = h.activities.map((a) => {
                                if (a.date == date) {
                                    a.value = newValue;
                                }
                                return a;
                            });
                            h.activities = newActivities;
                        }
                        return h;
                    });
                    c.habits = newHabits;
                }
                return c;
            });
            props.updateHabits({ ...props.data, categories: newCategories });
        },
        [props],
    );

    const filledHabitsMemo = useMemo(() => {
        const filledHabits = fillAll(props.data, today, 5, 5);
        const tableProps: ITableProps = {
            title: filledHabits.title,
            categories: filledHabits.categories,
            lockFuture: lockFuture,
            lockPast: lockPast,
            addCategory,
            addHabit,
            changeValue,
        };
        return tableProps;
    }, [
        addCategory,
        addHabit,
        changeValue,
        lockFuture,
        lockPast,
        props.data,
        today,
    ]);

    // TODO fix this so it does something again
    const toggleLockPast = useCallback(() => {
        setLockPast((prev) => !prev);
    }, [setLockPast]);

    const toggleLockFuture = useCallback(() => {
        setLockFuture((prev) => !prev);
    }, [setLockFuture]);

    return (
        <>
            <button className="" onClick={toggleLockPast}>
                {lockPast ? "🔒" : "🔓"} Past
            </button>
            <button onClick={toggleLockFuture}>
                {lockFuture ? "🔒" : "🔓"} Future
            </button>
            {filledHabitsMemo && <Table {...filledHabitsMemo} />}
        </>
    );
}
