// a row of checkboxes
import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckboxStateFromInt, ECheckbox, IECheckboxProps } from "./ECheckbox";
import { IEActivity, newExperiments } from "../../clients/experimentHabits";

export interface IEHabitProps {
    title: string;
    path: string;
    futureLocked: boolean;
    pastLocked: boolean;
}

// ERow is for a single activity.
// It will take as props the path to fetch and update with
// and the start and end times
// and the locked bools
// It will load the required ones, or create placeholders
export default function ERow(props: IEHabitProps) {
    const [activities, setActivities] = useState<IECheckboxProps[]>([]);

    const loadData = useCallback(() => {
        console.log("ERow path", props.path);
        newExperiments()
            .getHabitActivities(props.path)
            .then((as) => {
                const acts: IECheckboxProps[] = as.map((a: IEActivity) => {
                    const checkBoxProps: IECheckboxProps = {
                        date: a.date,
                        value: a.value,
                        state: CheckboxStateFromInt(a.value),
                        locked: false,
                        onClick() {
                            console.log("unimplemented at the mo");
                        },
                    };
                    return checkBoxProps;
                });
                console.log(acts);
                setActivities(acts);
            })
            .catch((e) => {
                console.log("failed to get habit activities", e);
            });
    }, [props.path]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const sortedActivities = useMemo<IECheckboxProps[]>(() => {
        if (activities.length == 0) {
            return [];
        }
        return activities.sort((activityA, activityB) => {
            return activityA.date - activityB.date;
        });
    }, [activities]);

    return (
        <>
            <div className="row">
                <span className="row-title">{props.title}</span>
                {sortedActivities.length > 0 ? (
                    sortedActivities.map((activity) => (
                        <ECheckbox {...activity} key={activity.date} />
                    ))
                ) : (
                    <>...</>
                )}
            </div>
        </>
    );
}
