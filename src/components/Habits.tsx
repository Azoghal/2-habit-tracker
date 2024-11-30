// import { ICategoryProps } from "@/components/Category";
// import { CheckboxStateFromInt, ICheckboxProps } from "@/components/Checkbox";
// import { IRowProps } from "@/components/Row";
// import Table from "@/components/Table";
import { IHabits } from "../types/habits";
// import {
// ICategoryMapped,
// IHabitMapped,
// IHabitsMapped,
// mapifyHabits,
// unmapifyHabits,
// } from "../types/habitsMaps";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fillAll, IHabitsMapped, mapifyHabits } from "../types/habitsMaps";
import { CheckboxStateFromInt, ICheckboxProps } from "./Checkbox";
import { IRowProps } from "./Row";
import Table from "./Table";
import { ICategoryProps } from "./Category";

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

    const [mappedHabits, setMappedHabits] = useState<IHabitsMapped>(
        fillAll(mapifyHabits(props.data), today, 5, 5),
    );

    const loadData = useCallback(() => {
        setMappedHabits(fillAll(mapifyHabits(props.data), today, 5, 5));
    }, [props.data, today, setMappedHabits]);

    useEffect(() => {
        loadData();
    }, []);

    // const updateMappedHabits = useCallback(
    //     (category: string, habit: string, date: number, newValue: number) => {
    //         console.log("called updateMappedHabitsCallback");
    //         setMappedHabits((old) => {
    //             const newHabits = { ...old };
    //             // TODO undo !
    //             const c: ICategoryMapped = newHabits.categories.get(category)!;
    //             const h: IHabitMapped = c.habits.get(habit)!;
    //             const nh = h.activities.set(date, newValue);
    //             console.log("Unimplemented update");
    //             // updateHabitCookie(
    //             //     filterZeroActivities(unmapifyHabits(newHabits)),
    //             // );
    //             return old;
    //         });
    //     },
    //     [setMappedHabits, lockPast, lockFuture],
    // );

    // const addCategory = useCallback(
    //     (categoryName: string) => {
    //         console.log("adding new category", categoryName);
    //         setMappedHabits((old) => {
    //             const updated: IHabitsMapped = { ...old };
    //             // TODO check that it doesn't already exist
    //             const newCategory: ICategoryMapped = {
    //                 habits: new Map(),
    //             };
    //             updated.categories.set(categoryName, newCategory);
    //             // updateHabitCookie(
    //             //     filterZeroActivities(unmapifyHabits(updated)),
    //             // );
    //             console.log("unimplemented update");
    //             return updated;
    //         });
    //         loadData();
    //     },
    //     [loadData, setMappedHabits],
    // );

    // TODO I think addHabit and addCategory should operate on the mapped guys
    // const addHabit = useCallback(
    //     (categoryName: string, habitName: string) => {
    //         console.log("adding new habit", categoryName, habitName);
    //         setMappedHabits((old) => {
    //             const updated: IHabitsMapped = { ...old };
    //             const category = updated.categories.get(categoryName)!;
    //             if (!category.habits.get(habitName)) {
    //                 const newHabit: IHabitMapped = {
    //                     activities: new Map(),
    //                 };
    //                 category.habits.set(habitName, newHabit);
    //             }
    //             // updateHabitCookie(
    //             //     filterZeroActivities(unmapifyHabits(updated)),
    //             // );
    //             console.log("unimplemented update");
    //             return updated;
    //         });
    //         loadData();
    //     },
    //     [props.data, loadData],
    // );

    // consolidate this and the effect below into a useMemo
    const tableHabits = useMemo(() => {
        const categories = new Map<string, ICategoryProps>();
        for (const [
            categoryName,
            categoryData,
        ] of mappedHabits.categories.entries()) {
            const categoryHabits = new Map<string, IRowProps>();
            for (const [
                habitName,
                habitData,
            ] of categoryData.habits.entries()) {
                const habitActivities = new Map<number, ICheckboxProps>();
                for (const [date, activity] of habitData.activities.entries()) {
                    habitActivities.set(date, {
                        date: date,
                        value: activity,
                        state: CheckboxStateFromInt(activity),
                        locked:
                            (date < today && lockPast) ||
                            (date > today && lockFuture),
                        onClick: () => {
                            console.log(
                                `I have been pressed (${categoryName}, ${habitName}, ${date}, ${activity}=>${(activity + 1) % 3})`,
                            );
                            // updateMappedHabits(
                            //     categoryName,
                            //     habitName,
                            //     date,
                            //     (activity + 1) % 3,
                            // );
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
                addHabit: () => {
                    console.log("removed");
                },
            });
        }

        return {
            title: props.data.title, // Replace with your desired title
            categories: categories,
        };
    }, [
        props.data.title,
        mappedHabits.categories,
        today,
        lockPast,
        lockFuture,
    ]);
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
