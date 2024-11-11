// a row of checkboxes
import { Checkbox, ICheckboxProps } from "./Checkbox";

export interface IRowProps {
  title: string;
  activities: Map<number, ICheckboxProps>;
}

export default function Row(props: IRowProps) {
  return (
    <>
      <div className="row">
        <span>---- {props.title}</span>
        {Array.from(props.activities.entries()).map(([date, activity]) => {
          // TODO lift the locked, onClick, conversion to state into the props
          return <Checkbox {...activity} key={date} />;
        })}
      </div>
    </>
  );
}
