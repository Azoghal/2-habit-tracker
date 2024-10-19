import { Checkbox, CheckboxState } from "@/components/Checkbox";
import Row from "@/components/Row";
import { useCallback, useMemo, useState } from "react";


export interface CheckboxInfo{
  key: string
  state: CheckboxState
}

function incrementState(checkState: CheckboxState){
  switch(checkState){
  case CheckboxState.Empty:
    return CheckboxState.Half;
  case CheckboxState.Half:
    return CheckboxState.Full;
  case CheckboxState.Full:
    return CheckboxState.Empty;
  }
}


export default function Index() {
  const [allValues, setAllValues] = useState<Map<string, CheckboxInfo>>(new Map(
    [['monday', {key: 'monday',  state:CheckboxState.Empty}],
     ['tuesday', {key: 'tuesday',  state:CheckboxState.Empty}]]
  ))

  const updateAValue = useCallback((key:string)=>{
    console.log("updating a value ",key)
    const currentInfo = allValues.get(key)
    console.log("current value", currentInfo?.state)
    if (currentInfo){
      setAllValues((prevMap)=>{
        const newMap = new Map(prevMap)
        newMap.set(
          key, 
          {...currentInfo, state: incrementState(currentInfo.state)}
        )
        return newMap
      })
    };
  },[allValues])

  return <>
    {/* <Checkbox state={checkState} onClick={updateCheck}/> */}
    <Row values={[...allValues.values()]} onUpdateCheckbox={updateAValue}/>
  </>;
}
