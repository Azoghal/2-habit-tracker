import { fillAll, IHabits } from "../types/habits";
import { useCallback, useMemo, useState } from "react";
import Table, { ITableProps } from "./Table";

export function getTodayMidday() {
    const now = new Date();
    now.setUTCHours(12, 0, 0, 0);
    return Math.floor(now.getTime() / 1000);
}

export interface IHabitsProps {
    data: IHabits;
}

export const DAY_SECONDS = 86400;
export const YEAR_MILLIS = 365 * DAY_SECONDS * 1000;

export default function Habits(props: IHabitsProps) {
    const today = getTodayMidday();
    const [lockPast, setLockPast] = useState(false);
    const [lockFuture, setLockFuture] = useState(false);

    const filledHabitsMemo = useMemo(() => {
        const filledHabits = fillAll(props.data, today, 5, 5);
        const tableProps: ITableProps = {
            title: filledHabits.title,
            categories: filledHabits.categories,
            lockFuture: lockFuture,
            lockPast: lockPast,
            addCategory: (newCategory: string) => {
                console.log("unimplimented", newCategory);
            },
            addHabit: (category: string, newHabit: string) => {
                console.log("unimplimented", category, newHabit);
            },
            changeValue: (
                category: string,
                habit: string,
                date: number,
                newValue: number,
            ) => {
                console.log("unimplimented", category, habit, date, newValue);
            },
        };
        return tableProps;
    }, [lockFuture, lockPast, props.data, today]);

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
            {filledHabitsMemo && (
                <Table
                    {...filledHabitsMemo}
                    addCategory={() => {
                        console.log("removed");
                    }}
                />
            )}
        </>
    );
}
