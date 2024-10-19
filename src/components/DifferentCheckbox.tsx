import { useEffect, useMemo, useRef } from "react";


interface IntermediateCheckboxProps {
    onClick():void;
    state: number;
    // label,
    // color,
    // disabled,
    // name,
    // value,
    // onChange,
    // checked,
}


export function DifferentCheckbox(props: IntermediateCheckboxProps) {
    const cRef = useRef(null);
  
    useEffect(() => {
      if (cRef.current) {
        cRef.current!.indeterminate = props.state == 1 
      };
    }, [cRef, props.state]);
  
    return (
      <div className="checkbox-content" onClick={props.onClick}>
        <label>
          <input
            type="checkbox"
            name={"frank"}
            // value={}
            checked={props.state==2}
            onClick={()=>{}}
            onChange={()=>{}}
            ref={cRef}
          />
          <span>{"frank"}</span>
        </label>
      </div>
    );
  };
  