// a row of checkboxes
import { useMemo } from "react";
import { Checkbox, ICheckboxProps } from "./Checkbox";

export interface IRowProps {
  title: string;
  activities: Map<number, ICheckboxProps>;
}

export default function Row(props: IRowProps) {
  const sortedActivities = useMemo<Array<JSX.Element>>(() => {
    const entries = Array.from(props.activities.entries());
    const sorted = entries.sort(([dateA, _propsA], [dateB, _propsB]) => {
      return dateA - dateB;
    });
    return entries.map(([date, activity]) => {
      return <Checkbox {...activity} key={date} />;
    });
  }, [props.activities]);

  return (
    <>
      <div className="row">
        <span className="row-title">---- {props.title}</span>
        {sortedActivities}
      </div>
    </>
  );
}
