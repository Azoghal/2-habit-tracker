// a row of checkboxes
import { useEffect, useMemo, useState } from "react";
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

    useEffect(() => {
        newExperiments()
            .getHabitActivities(props.path)
            .then((as) => {
                const bobs: IECheckboxProps[] = as.map((a: IEActivity) => {
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
                setActivities(bobs);
            });
    }, []);

    const sortedActivities = useMemo<Array<JSX.Element>>(() => {
        if (activities.length > 0) {
            return [];
        }
        const sorted = activities.sort((activityA, activityB) => {
            return activityA.date - activityB.date;
        });
        return sorted.map((activity) => {
            return <ECheckbox {...activity} key={activity.date} />;
        });
    }, [activities]);

    return (
        <>
            <div className="row">
                <span className="row-title">{props.title}</span>
                {sortedActivities}
            </div>
        </>
    );
}
