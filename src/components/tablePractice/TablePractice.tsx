import { useEffect, useMemo } from "react";
import { DAY_SECONDS, getTodayMidday } from "../experiment/EHabits";
import { EBox } from "../experiment/EBox";

const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

const DaysOfWeekShort = ["M", "T", "W", "T", "F", "S", "S"];

export function TablePractice() {
    const today = getTodayMidday();

    // TODO fix
    const dayOfWeek = getDayOfWeek(today);
    const beginningOfWeek = today - dayOfWeek * DAY_SECONDS; // start on a monday
    const endOfNextWeek = beginningOfWeek + DAY_SECONDS * 13; // finish on a sunday
    const dates: number[] = [];
    for (let t = beginningOfWeek; t <= endOfNextWeek; t += DAY_SECONDS) {
        dates.push(t);
    }

    return (
        <AnTable
            startDate={beginningOfWeek}
            endDate={endOfNextWeek}
            dates={dates}
        />
    );
}

function getDayOfWeek(unixTimestamp: number): number {
    const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
    const dayNumber = date.getDay() % 7; // 0 (sunday) to 6 (saturday)
    let dayNumberAdjusted = dayNumber - 1;
    if (dayNumberAdjusted < 0) {
        dayNumberAdjusted += 7;
    }
    return dayNumberAdjusted;
}

interface IAnTableProps {
    startDate: number;
    endDate: number;
    dates: number[];
}

function AnTable(props: IAnTableProps): JSX.Element {
    useEffect(() => {
        console.log(props.startDate, "-->", props.endDate);
        console.log(props.startDate > props.endDate);

        const startDay = daysOfWeek[getDayOfWeek(props.startDate)];
        const endDay = daysOfWeek[getDayOfWeek(props.endDate)];

        console.log("start", startDay, "end", endDay);
    });

    // produces the headers
    // inserts a blank between each week.
    const calculateHeaders = useMemo(() => {
        const headers = [];
        for (let t = props.startDate; t <= props.endDate; t += DAY_SECONDS) {
            console.log("loop", t);
            const dow = getDayOfWeek(t);
            if (dow == 0) {
                headers.push(<th key={"wb" + t}> | </th>); // Add a blank column to indicate week beginning
            }
            headers.push(<th key={t}>{DaysOfWeekShort[dow]}</th>);
        }
        console.log(headers);
        return headers;
    }, [props.startDate, props.endDate]);

    return (
        <table>
            <thead>
                <tr>
                    <th></th>
                    {calculateHeaders}
                </tr>
            </thead>
            <tbody>
                <AnCategory dates={props.dates} />
                <AnCategory dates={props.dates} />
            </tbody>
        </table>
    );
}

interface IAnCategoryProps {
    dates: number[];
}

function AnCategory(props: IAnCategoryProps) {
    return (
        <>
            <tr>
                <td>Section Header</td>
            </tr>
            <AnHabit {...props} />
            <AnHabit {...props} />
        </>
    );
}

interface IAnHabitProps {
    dates: number[];
}

function AnHabit(props: IAnHabitProps) {
    return (
        <>
            <tr>
                <td>Subsection 1</td>
                {props.dates.map((date) =>
                    getDayOfWeek(date) == 0 ? (
                        <>
                            <td></td>
                            <td>
                                <EBox state={0} />
                            </td>
                        </>
                    ) : (
                        <td>
                            <EBox state={0} />
                        </td>
                    ),
                )}
            </tr>
        </>
    );
}
