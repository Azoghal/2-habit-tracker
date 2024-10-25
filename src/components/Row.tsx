// a row of checkboxes

import { Checkbox } from "./Checkbox";
import { CheckboxInfo } from "@/pages";

export interface IRowProps{
    values: CheckboxInfo[];
    onUpdateCheckbox: (key:number)=>void;
    currentDay: number;
    lockPast:boolean;
    lockFuture: boolean;
    title: string;
}

function shouldLock(currentDay: number, day:number, lockPast:boolean, lockFuture:boolean):boolean {
    if (day < currentDay && lockPast) {
        return true
    }
    if (day > currentDay && lockFuture){
        return true
    }
    return false
}

export default function Row(props:IRowProps) {

    console.log("my row rendery props", props.values)

    return <>
        <div className="row">
            <span>{props.title}</span>
            {props.values.map((info)=>{
            return <Checkbox 
                key={info.key} 
                info={info} 
                disabled={shouldLock(props.currentDay, info.key, props.lockPast, props.lockFuture)} 
                onClick={()=>{props.onUpdateCheckbox(info.key)}}
            />
        })}
        </div>
    </>
}