import { useCallback, useState } from "react";
import ETable from "./ETable";

export function getTodayMidday() {
    const now = new Date();
    now.setUTCHours(12, 0, 0, 0);
    return Math.floor(now.getTime() / 1000);
}

export interface IEHabitsProps {
    title: string;
    path: string;
    // other stuff?
}

export const DAY_SECONDS = 86400;
export const YEAR_MILLIS = 365 * DAY_SECONDS * 1000;

// EHabits makes a table. I don;t think its necessary.
// it just needs to get all the category names, create categories.
export default function EHabits(props: IEHabitsProps) {
    const [lockPast, setLockPast] = useState(false);
    const [lockFuture, setLockFuture] = useState(true);

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
            {
                <ETable
                    title={props.title}
                    path={props.path}
                    lockFuture={lockFuture}
                    lockPast={lockPast}
                />
            }
        </>
    );
}
