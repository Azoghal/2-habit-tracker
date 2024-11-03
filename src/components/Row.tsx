// a row of checkboxes

import { IHabit } from "@/types/habits";
import { Checkbox, ICheckboxProps } from "./Checkbox";

export interface IRowProps {
    title: string
    activities: ICheckboxProps[]
}

export default function Row(props:IRowProps) {

    console.log("my row rendery props", props.activities)

    return <>
        <div className="row">
            <span>{props.title}</span>
            {props.activities.map((activity)=>{
                // TODO lift the locked, onClick, conversion to state into the props
            return <Checkbox {...activity} key={activity.date}/>
        })}
        </div>
    </>
}