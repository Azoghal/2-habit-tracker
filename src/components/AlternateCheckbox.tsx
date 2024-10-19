import { useMemo } from "react";


interface ICheckboxProps {
    onClick():void;
    state: number;
}

export default function AlternateCheckbox(props: ICheckboxProps) {    
    const className = useMemo(()=>{
        console.log("regenerating classname")
        switch (props.state){
        case 1:
            return "checkbox-alternate"
        case 2:
            return "checkbox-alternate--half-checked"
        case 3:
            return "checkbox-alternate--checked"
        } 
    }, [props.state])

    return <div className="checkbox-container" onClick={props.onClick}>
      <div className={className} />
    </div>

    return <></>
  }
  