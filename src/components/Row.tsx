// a row of checkboxes

import { useCallback, useMemo, useState } from "react";
import { Checkbox, CheckboxState } from "./Checkbox";
import { CheckboxInfo } from "@/pages";

interface IRowProps{
    values: CheckboxInfo[];
    onUpdateCheckbox: (key:string)=>void;
}

export default function Row(props:IRowProps) {

    console.log("my row rendery props", props.values)

    const row = useMemo(()=>{
        return props.values.map((info)=>{
            return <Checkbox key={info.key} info={info} onClick={()=>{props.onUpdateCheckbox(info.key)}}/>
        })
    },[props.values])

    return <>
        <div className="row">
            {row}
        </div>
    </>
}