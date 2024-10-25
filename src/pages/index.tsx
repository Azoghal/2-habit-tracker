import { CheckboxState } from "@/components/Checkbox";
import Table, { ITableProps} from "@/components/Table";
import { useCallback, useEffect, useMemo, useState } from "react";



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
  const yesterday = today - daySeconds; // TODO remove eventually, just for hardcoding
  const tomorrow = today + daySeconds;

  // const [allValues, setAllValues] = useState<Map<number, CheckboxInfo>>(new Map(
  //   [[yesterday, {key: yesterday,  state:CheckboxState.Empty}],
  //    [today, {key: today,  state:CheckboxState.Empty}],
  //    [tomorrow, {key: tomorrow,  state:CheckboxState.Empty}]]
  // ))

  const [currentDate, setCurrentDate] = useState(getTodayMidday());
  const [lockPast, setLockPast] = useState(true);
  const [lockFuture, setLockFuture] = useState(true);

  const shouldLock = useCallback((day: number)=>{
    if (day < today && lockPast) {
        return true
    }
    if (day > today && lockFuture){
        return true
    }
    return false
  }, [today, lockPast, lockFuture])

  // TODO rather than hardcode this, we can deserialise this from json
  const [tableState, setTableState] = useState<ITableProps>({
    title: "Habits",
    categories: [
      {
        title: "Exercise",
        rows: [
          {
            title: "Running",
            values: [
              {
                key: yesterday,
                onClick: ()=>{console.log("try to update", yesterday)},
                state: CheckboxState.Half,
                locked: shouldLock(yesterday)
              },
              {
                key: today,
                onClick: ()=>{console.log("try to update", today)},
                state: CheckboxState.Empty,
                locked: shouldLock(today)
              },
              {
                key: tomorrow,
                onClick: ()=>{console.log("try to update", tomorrow)},
                state: CheckboxState.Empty,
                locked: shouldLock(tomorrow)
              }
            ]
          },
          {
            title: "Cycling",
            values: [
              {
                key: yesterday,
                onClick: ()=>{console.log("try to update", yesterday)},
                state: CheckboxState.Full,
                locked: shouldLock(yesterday)
              },
              {
                key: today,
                onClick: ()=>{console.log("try to update", today)},
                state: CheckboxState.Empty,
                locked: shouldLock(today)
              },
              {
                key: tomorrow,
                onClick: ()=>{console.log("try to update", tomorrow)},
                state: CheckboxState.Empty,
                locked: shouldLock(tomorrow)
              }
            ]
          }
        ],
      }
    ]
  } as ITableProps)

  const loadData = useCallback(()=>{

  }, [])

  // const updateAValue = useCallback((key:number)=>{
  //   console.log("updating a value ",key)
  //   const currentInfo = allValues.get(key)
  //   console.log("current value", currentInfo?.state)
  //   if (currentInfo){
  //     // TODO update this to update the new thing
  //     setAllValues((prevMap)=>{
  //       const newMap = new Map(prevMap)
  //       newMap.set(
  //         key, 
  //         {...currentInfo, state: incrementState(currentInfo.state)}
  //       )
  //       return newMap
  //     })
  //   };
  // },[allValues])

  const toggleLockPast = useCallback(()=>{
    setLockPast((prev)=>!prev)
  }, [lockPast])

  const toggleLockFuture = useCallback(()=>{
    setLockFuture((prev)=>!prev)
  }, [lockPast])

  useEffect(()=>{
    loadData()
  },[])

  return <>
    {/* <Checkbox state={checkState} onClick={updateCheck}/> */}
    <button className="" onClick={toggleLockPast}>{lockPast? "🔒":"🔓"} Past</button>
    <button onClick={toggleLockFuture}>{lockFuture?"🔒":"🔓"} Future</button>
    {/* <Row title={"Code"} values={[...allValues.values()]} onUpdateCheckbox={updateAValue} currentDay={today} lockPast={lockPast} lockFuture={lockFuture}/> */}
    {<Table {...tableState}/>}
  </>;
}
