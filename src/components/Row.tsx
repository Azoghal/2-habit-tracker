// a row of checkboxes
import { useMemo } from "react";
import { Checkbox, ICheckboxProps } from "./Checkbox";

export interface IHabitProps {
    title: string;
    activities: ICheckboxProps[];
}

export default function Row(props: IHabitProps) {
    const sortedActivities = useMemo<Array<JSX.Element>>(() => {
        const sorted = props.activities.sort((activityA, activityB) => {
            return activityA.date - activityB.date;
        });
        return sorted.map((activity) => {
            return <Checkbox {...activity} key={activity.date} />;
        });
    }, [props.activities, props.title]);

    return (
        <>
            <div className="row">
                <span className="row-title">{props.title}</span>
                {sortedActivities}
            </div>
        </>
    );
}
