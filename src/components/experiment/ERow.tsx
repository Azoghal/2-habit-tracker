// a row of checkboxes
import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckboxStateFromInt, ECheckbox, IECheckboxProps } from "./ECheckbox";
import { IEActivity, newExperiments } from "../../clients/experimentHabits";
import { getTodayMidday } from "./EHabits";
import { getDayOfWeek } from "./helpers";

export interface IEHabitProps {
    title: string;
    path: string;
    futureLocked: boolean;
    pastLocked: boolean;
    //TODO move into a table settings context?
    dates: number[];
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
        return (
            <tr>
                <td>...</td>
            </tr>
        );
    }

    return (
        <EDateFilledRow
            activities={activities}
            title={props.title}
            dates={props.dates}
            lockFuture={props.futureLocked}
            lockPast={props.pastLocked}
            updateCheckbox={updateCheckbox}
        ></EDateFilledRow>
    );
}

interface IEDateFilledRowProps {
    activities: IEActivity[];
    title: string;
    dates: number[];
    lockPast: boolean;
    lockFuture: boolean;
    updateCheckbox(date: number, newValue: number): void;
}

function EDateFilledRow(props: IEDateFilledRowProps): JSX.Element {
    const [checkboxProps, setCheckboxProps] = useState<IECheckboxProps[]>();

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
                        (props.lockPast && a.date < getTodayMidday()) ||
                        (props.lockFuture && a.date > getTodayMidday()),
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
        props.lockFuture,
        props.lockPast,
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
            <td className="row-title">{props.title}</td>
            {rowBoxes}
        </tr>
    );
}
