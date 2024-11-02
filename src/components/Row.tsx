// a row of checkboxes

import { IHabit } from "@/types/habits";
import { Checkbox, CheckboxStateFromInt, ICheckboxProps } from "./Checkbox";

export interface IRowProps {
    title: string
    habit: ICheckboxProps[]
}

export default function Row(props:IRowProps) {

    console.log("my row rendery props", props.habit)

    return <>
        <div className="row">
            <span>{props.title}</span>
            {props.habit.map((activity)=>{
                // TODO lift the locked, onClick, conversion to state into the props
            return <Checkbox {...activity}/>
        })}
        </div>
    </>
}