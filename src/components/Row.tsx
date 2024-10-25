// a row of checkboxes

import { Checkbox, CheckboxInfo } from "./Checkbox";

export interface IRowProps{
    values: CheckboxInfo[];
    title: string;
}

export default function Row(props:IRowProps) {

    console.log("my row rendery props", props.values)

    return <>
        <div className="row">
            <span>{props.title}</span>
            {props.values.map((info)=>{
            return <Checkbox {...info}/>
        })}
        </div>
    </>
}