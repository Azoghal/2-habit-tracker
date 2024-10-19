import AlternateCheckbox from "@/components/AlternateCheckbox";
import Checkbox, { CheckboxState } from "@/components/Checkbox";
import { DifferentCheckbox } from "@/components/DifferentCheckbox";
import { useCallback, useState } from "react";

export default function Index() {
  const [checkState, setCheckState] = useState(CheckboxState.Half);

  const updateCheck = useCallback(()=>{
    console.log("updating check, currentValue", checkState)
    switch(checkState){
    case CheckboxState.Empty:
      return setCheckState(CheckboxState.Half);
    case CheckboxState.Half:
      return setCheckState(CheckboxState.Full);
    case CheckboxState.Full:
      return setCheckState(CheckboxState.Empty);
    }
  }, [checkState, setCheckState])

  return <>
    <Checkbox state={checkState} onClick={updateCheck}/>
    {/* <AlternateCheckbox state={checkState} onClick={updateCheck}/> */}
    <DifferentCheckbox state={checkState} onClick={updateCheck} />
  </>;
}
