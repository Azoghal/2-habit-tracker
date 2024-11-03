import { IActivity } from "@/types/habits";
import { useCallback, useEffect, useMemo, useRef } from "react";

export enum CheckboxState {
    Empty = 0,
    Half = 1,
    Full = 2,
}

export function CheckboxStateFromInt(s: number): CheckboxState {
  switch (s){
    case 1: 
      return CheckboxState.Half;
    case 2: 
      return CheckboxState.Full;
    default: 
      return CheckboxState.Empty;
  }
}

// TODO turn this into IActivity + locked + onClick. Maybe this means turning everything into types and using pick
export interface ICheckboxProps{
  date: number;
  value: number;
  state: CheckboxState
  locked: boolean;
  onClick():void;
}

// export interface CheckboxInfo{
//   onClick():void;
//   key: number // unix timestamp in seconds, should be 12:00pm UTC
//   state: CheckboxState
//   locked: boolean
// }

function backToDate(epochSeconds: number): Date{
  const date = new Date(epochSeconds * 1000);
  return date;
}

function formatShortDate(date: Date): string{
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

export function Checkbox(props: ICheckboxProps) {
    const cRef = useRef(null);

    // console.log("my rendery props", props)
  
    useEffect(() => {
      if (cRef.current) {
        // @ts-ignore
        cRef.current.indeterminate =
         props.value == CheckboxState.Half
      };
    }, [cRef, props.value]);

    const name = useMemo(()=>{
      return formatShortDate(backToDate(props.date))
    },[props.value])

    const onLocalClick = useCallback(()=>{
      if(!props.locked){
        props.onClick()
      }
    }, [props.onClick, props.locked])
  
    return (
      <div className="checkbox-container" onClick={onLocalClick}>
        <label className="checkbox-inner">
          <input
            type="checkbox"
            className="checkbox-inner"
            name={name}
            disabled={props.locked}
            // value={}
            checked={props.state==CheckboxState.Full}
            onClick={()=>{}}
            onChange={()=>{}}
            ref={cRef}
          />
          {/* <span></span>  */}
        </label>
      </div>
    );
  };
  