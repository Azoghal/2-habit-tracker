import { useCallback, useEffect, useMemo, useRef } from "react";

export enum CheckboxState {
    Empty = 1,
    Half = 2,
    Full = 3,
}

export interface CheckboxInfo{
  onClick():void;
  key: number // unix timestamp in seconds, should be 12:00pm UTC
  state: CheckboxState
  locked: boolean
}

function backToDate(epochSeconds: number): Date{
  const date = new Date(epochSeconds * 1000);
  return date;
}

function formatShortDate(date: Date): string{
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

export function Checkbox(props: CheckboxInfo) {
    const cRef = useRef(null);

    // console.log("my rendery props", props)
  
    useEffect(() => {
      if (cRef.current) {
        // @ts-ignore
        cRef.current.indeterminate =
         props.state == CheckboxState.Half
      };
    }, [cRef, props.state]);

    const name = useMemo(()=>{
      return formatShortDate(backToDate(props.key))
    },[props.key])

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
  