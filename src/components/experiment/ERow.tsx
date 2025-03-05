// a row of checkboxes
import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckboxStateFromInt, ECheckbox, IECheckboxProps } from "./ECheckbox";
import { IEActivity, newExperiments } from "../../clients/experimentHabits";
import { getTodayMidday } from "./EHabits";
import { getDayOfWeek } from "./helpers";
import { useTableSettings } from "../../context/TableSettings";
import { BinButton } from "../Buttons";

export interface IEHabitProps {
    title: string;
    path: string;
    dates: number[];
    allowDelete: boolean;
    onDelete(): void;
}

// ERow is for a single activity.
// It will take as props the path to fetch and update with
// and the start and end times
// and the locked bools
// It will load the required ones, or create placeholders
export default function ERow(props: IEHabitProps) {
    const [activities, setActivities] = useState<IEActivity[]>();

    const loadData = useCallback(() => {
        newExperiments()
            .getHabitActivities(props.path)
            .then((as) => {
                setActivities(as);
            })
            .catch((e) => {
                console.log("failed to get habit activities", e);
                setActivities([]);
            });
    }, [props.path]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const updateCheckbox = useCallback(
        (date: number, newValue: number) => {
            newExperiments()
                .setActivities(props.path, date, newValue)
                .then(() => {
                    loadData();
                });
        },
        [loadData, props.path],
    );

    if (activities == undefined) {
        return <></>;
    }

    return (
        <EDateFilledRow
            activities={activities}
            title={props.title}
            dates={props.dates}
            updateCheckbox={updateCheckbox}
            allowDelete={props.allowDelete}
            onDelete={props.onDelete}
        />
    );
}

interface IEDateFilledRowProps {
    activities: IEActivity[];
    title: string;
    dates: number[];
    updateCheckbox(date: number, newValue: number): void;
    allowDelete: boolean;
    onDelete(): void;
}

function EDateFilledRow(props: IEDateFilledRowProps): JSX.Element {
    const [checkboxProps, setCheckboxProps] = useState<IECheckboxProps[]>();
    const { lockPast, lockFuture } = useTableSettings();

    console.log("rerender edate filled row");

    useEffect(() => {
        const activities = props.activities;

        // filter out the ones that are outside the range
        const filteredActivities = activities.filter((activity) => {
            return props.dates.includes(activity.date);
        });

        // get existing dates so we can add the non existing ones
        const existingDates = filteredActivities.map((activity) => {
            return activity.date;
        });

        // add the missing dates with value 0
        props.dates.forEach((date) => {
            if (!existingDates.includes(date)) {
                const newActivity: IEActivity = {
                    date,
                    value: 0,
                };
                filteredActivities.push(newActivity);
            }
        });

        // convert them to propy boys
        const acts: IECheckboxProps[] = filteredActivities.map(
            (a: IEActivity) => {
                const checkBoxProps: IECheckboxProps = {
                    date: a.date,
                    value: a.value,
                    state: CheckboxStateFromInt(a.value),
                    locked:
                        (lockPast && a.date < getTodayMidday()) ||
                        (lockFuture && a.date > getTodayMidday()),
                    onClick() {
                        props.updateCheckbox(a.date, (a.value + 1) % 3);
                    },
                };
                return checkBoxProps;
            },
        );

        setCheckboxProps(
            acts.sort((activityA, activityB) => {
                return activityA.date - activityB.date;
            }),
        );
    }, [
        props,
        props.activities,
        props.dates,
        lockFuture,
        lockPast,
        setCheckboxProps,
    ]);

    const rowBoxes = useMemo(() => {
        const r: JSX.Element[] = [];
        if (checkboxProps == undefined) {
            return r;
        }
        checkboxProps.forEach((activity) => {
            if (getDayOfWeek(activity.date) == 0) {
                r.push(<td key={"wb" + activity.date} />);
            }
            r.push(
                <td key={activity.date}>
                    <ECheckbox {...activity} />
                </td>,
            );
        });
        return r;
    }, [checkboxProps]);

    return (
        <tr>
            <td className="row-title">
                {props.allowDelete && <BinButton onClick={props.onDelete} />}
                {props.title}
            </td>
            {rowBoxes}
        </tr>
    );
}
