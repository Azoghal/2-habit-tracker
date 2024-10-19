import { useMemo } from "react";

export enum CheckboxState {
    Empty = 1,
    Half,
    Full,
}

interface ICheckboxProps {
    onClick():void;
    state: CheckboxState
}

export default function Checkbox(props: ICheckboxProps) {    
    const className = useMemo(()=>{
        console.log("regenerating classname")
        switch (props.state){
        case CheckboxState.Empty:
            return "checkbox-inner checkbox-inner__empty"
        case CheckboxState.Half:
            return "checkbox-inner checkbox-inner__half"
        case CheckboxState.Full:
            return "checkbox-inner checkbox-inner__full"
        } 
    }, [props.state])

    return <div className={className} onClick={props.onClick}/>
  }
  