import { CheckboxInfo } from "@/pages";
import { useEffect, useRef } from "react";

export enum CheckboxState {
    Empty = 1,
    Half,
    Full,
}

interface ICheckboxProps {
    onClick():void;
    info: CheckboxInfo;
}

export function Checkbox(props: ICheckboxProps) {
    const cRef = useRef(null);

    console.log("my rendery props", props.info)
  
    useEffect(() => {
      if (cRef.current) {
        // @ts-ignore
        cRef.current.indeterminate =
         props.info.state == CheckboxState.Half
      };
    }, [cRef, props.info.state]);
  
    return (
      <div className="checkbox-content" onClick={props.onClick}>
        <label>
          <input
            type="checkbox"
            name={props.info.key}
            // value={}
            checked={props.info.state==CheckboxState.Full}
            onClick={()=>{}}
            onChange={()=>{}}
            ref={cRef}
          />
          <span>{props.info.key}</span>
        </label>
      </div>
    );
  };
  