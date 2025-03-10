import ETable from "./ETable";
import { useTableSettings } from "../../context/TableSettings";

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

// EHabits is now looking rather unecessary
export default function EHabits(props: IEHabitsProps) {
    const { days } = useTableSettings();

    return (
        <>
            <ETable title={props.title} path={props.path} dates={days} />
        </>
    );
}
