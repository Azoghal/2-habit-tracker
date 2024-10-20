import { Checkbox, CheckboxState } from "@/components/Checkbox";
import Row from "@/components/Row";
import { useCallback, useMemo, useState } from "react";


export interface CheckboxInfo{
  key: number // unix timestamp in seconds, should be 12:00pm UTC
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

function getTodayMidday(){
  const now = new Date();
  now.setUTCHours(12, 0, 0, 0);
  return Math.floor(now.getTime()/1000);
}

export default function Index() {

  const daySeconds = 86400;
  const today = getTodayMidday();
  const yesterday = today - daySeconds;
  const tomorrow = today + daySeconds;

  const [allValues, setAllValues] = useState<Map<number, CheckboxInfo>>(new Map(
    [[yesterday, {key: yesterday,  state:CheckboxState.Empty}],
     [today, {key: today,  state:CheckboxState.Empty}],
     [tomorrow, {key: tomorrow,  state:CheckboxState.Empty}]]
  ))

  const [lockPast, setLockPast] = useState(true);
  const [lockFuture, setLockFuture] = useState(true);

  const updateAValue = useCallback((key:number)=>{
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

  const toggleLockPast = useCallback(()=>{
    setLockPast((prev)=>!prev)
  }, [lockPast])

  const toggleLockFuture = useCallback(()=>{
    setLockFuture((prev)=>!prev)
  }, [lockPast])

  return <>
    {/* <Checkbox state={checkState} onClick={updateCheck}/> */}
    <button className="" onClick={toggleLockPast}>{lockPast? "🔒":"🔓"} Past</button>
    <button onClick={toggleLockFuture}>{lockFuture?"🔒":"🔓"} Future</button>
    <Row title={"Code"} values={[...allValues.values()]} onUpdateCheckbox={updateAValue} currentDay={today} lockPast={lockPast} lockFuture={lockFuture}/>
  </>;
}
