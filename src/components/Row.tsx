// a row of checkboxes

import { IHabit } from "@/types/habits";
import { Checkbox, CheckboxStateFromInt } from "./Checkbox";

export default function Row(props:IHabit) {

    console.log("my row rendery props", props.activities)

    return <>
        <div className="row">
            <span>{props.title}</span>
            {props.activities.map((activity)=>{
                // TODO lift the locked, onClick, conversion to state into the props
            return <Checkbox onClick={()=>{}} date={activity.date} value={activity.value} state={CheckboxStateFromInt(activity.value)} locked={false}/>
        })}
        </div>
    </>
}