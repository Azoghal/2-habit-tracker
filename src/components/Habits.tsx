import { fillAll, IHabits } from "../types/habits";
import { useCallback, useEffect, useMemo, useState } from "react";
import Table, { ITableProps } from "./Table";

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
    const today = getTodayMidday();
    const [lockPast, setLockPast] = useState(false);
    const [lockFuture, setLockFuture] = useState(false);

    const [filledHabits, setFilledHabits] = useState<IHabits>(
        fillAll(props.data, today, 5, 5),
    );

    const loadData = useCallback(() => {
        setFilledHabits(fillAll(props.data, today, 5, 5));
    }, [props.data, today]);

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.data]);

    const tableHabits = useMemo(() => {
        const tableProps: ITableProps = {
            title: filledHabits.title, // Replace with your desired title
            categories: filledHabits.categories,
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
    }, [filledHabits.categories, filledHabits.title]);

    // TODO fix this so it does something again
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
            <button onClick={loadData}>Refresh</button>
            {/* <Row title={"Code"} values={[...allValues.values()]} onUpdateCheckbox={updateAValue} currentDay={today} lockPast={lockPast} lockFuture={lockFuture}/> */}
            {tableHabits && (
                <Table
                    {...tableHabits}
                    addCategory={() => {
                        console.log("removed");
                    }}
                />
            )}
        </>
    );
}
