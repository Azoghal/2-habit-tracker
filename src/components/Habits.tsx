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
    const [lockFuture, setLockFuture] = useState(true);

    // Represents a "staged" view of the habits.
    // as long as we call setHabits only via the updateHabits callback,
    // behaviour should be good.
    const [habits, setHabits] = useState<IHabits>(props.data);

    const updateHabits = useCallback(
        (newHabits: IHabits) => {
            setHabits(newHabits);
            props.updateHabits(newHabits);
        },
        [setHabits, props],
    );

    const addCategory = useCallback(
        (categoryName: string) => {
            const newCategory: ICategory = {
                title: categoryName,
                habits: [],
            };
            updateHabits({
                ...habits,
                categories: habits.categories.concat(newCategory),
            });
        },
        [habits, updateHabits],
    );

    const addHabit = useCallback(
        (category: string, newHabit: string) => {
            const newCategories = habits.categories.map((c: ICategory) => {
                if (c.title == category) {
                    const habit: IHabit = {
                        title: newHabit,
                        activities: [],
                    };
                    c.habits.push(habit);
                }
                return c;
            });
            updateHabits({ ...habits, categories: newCategories });
        },
        [habits, updateHabits],
    );

    const changeValue = useCallback(
        (category: string, habit: string, date: number, newValue: number) => {
            const newCategories = habits.categories.map((c: ICategory) => {
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
            updateHabits({ ...habits, categories: newCategories });
        },
        [habits, setHabits],
    );

    const filledHabitsMemo = useMemo(() => {
        const filledHabits = fillAll(habits, today, 5, 5);
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
        habits,
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
