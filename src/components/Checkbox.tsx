import { CheckboxInfo } from "@/pages";
import { useCallback, useEffect, useMemo, useRef } from "react";

export enum CheckboxState {
    Empty = 1,
    Half,
    Full,
}

interface ICheckboxProps {
    onClick():void;
    info: CheckboxInfo;
    disabled: boolean;
}

function backToDate(epochSeconds: number): Date{
  const date = new Date(epochSeconds * 1000);
  return date;
}

function formatShortDate(date: Date): string{
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
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

    const name = useMemo(()=>{
      return formatShortDate(backToDate(props.info.key))
    },[props.info.key])

    const onLocalClick = useCallback(()=>{
      if(!props.disabled){
        props.onClick()
      }
    }, [props.onClick, props.disabled])
  
    return (
      <div className="checkbox-container" onClick={onLocalClick}>
        <label className="checkbox-inner">
          <input
            type="checkbox"
            className="checkbox-inner"
            name={name}
            disabled={props.disabled}
            // value={}
            checked={props.info.state==CheckboxState.Full}
            onClick={()=>{}}
            onChange={()=>{}}
            ref={cRef}
          />
          {/* <span></span>  */}
        </label>
      </div>
    );
  };
  