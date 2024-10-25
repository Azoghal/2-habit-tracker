import { CheckboxInfo, CheckboxState, CheckboxStateFromInt } from "@/components/Checkbox";
import { IRowProps } from "@/components/Row";
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

const jsonRep = `{"title": "Habits of Sam", "categories": [{"title":"Exercise","habits":}]}`

// a static representation of the data, same as it will be in json

// 
type CategoryMap = Map<string, HabitMap>
type HabitMap = Map<string, Habit>
interface Habit {
  // map of date as epoch seconds to state (0, 1, 2)
  activity: Map<number, number>
}
interface AppState {
  title: string,
  categories: CategoryMap,
}


export default function Index() {

  const daySeconds = 86400;
  const today = getTodayMidday();
  const yesterday = today - daySeconds; // TODO remove eventually, just for hardcoding
  const tomorrow = today + daySeconds;

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


  const exampleState = {
    title: "Habits of Sam",
    categories: new Map<string, HabitMap>([["Exercise", new Map<string,Habit>([["Running", {activity: new Map<number,number>([[yesterday, 2],[today, 1],[tomorrow, 0]]), }]])]])
  } as AppState

  const [appState, useAppState] = useState<AppState>(exampleState);


const tableProps = useMemo<ITableProps>(() => {
  const tableProps: ITableProps = {
    title: appState.title,
    categories: appState.categories.entries().map((value: [categoryName: string, categoryHabits: HabitMap])=>{
      const categoryName = value[0]
      const categoryHabits = value[1]
      return {
        title: categoryName,
        rows: categoryHabits.entries().map((value: [habitName: string, habit: Habit])=>{
          const habitName = value[0]
          const habit = value[1]  
          return {
            title: habitName,
            values: habit.activity.entries().map((value: [date:number, fillValue: number])=>{
              const date = value[0]
              const fillValue = value[1]
              return {
                onClick: ()=>{console.log("should increment ", categoryName, habitName, date)},
                key: date,
                state: CheckboxStateFromInt(fillValue),
                locked: shouldLock(date)
              } as CheckboxInfo
            }).toArray()
          } as IRowProps
        }).toArray()
      }
    }).toArray()
  }
  
  return tableProps
}, [exampleState])


  // const [allValues, setAllValues] = useState<Map<number, CheckboxInfo>>(new Map(
  //   [[yesterday, {key: yesterday,  state:CheckboxState.Empty}],
  //    [today, {key: today,  state:CheckboxState.Empty}],
  //    [tomorrow, {key: tomorrow,  state:CheckboxState.Empty}]]
  // ))

  // TODO rather than hardcode this, we can produce this from the object we've deserialised from json (which is the source of truth)
  // const [tableState, setTableState] = useState<ITableProps>({
  //   title: "Habits",
  //   categories: [
  //     {
  //       title: "Exercise",
  //       rows: [
  //         {
  //           title: "Running",
  //           values: [
  //             {
  //               key: yesterday,
  //               onClick: ()=>{console.log("try to update", yesterday)},
  //               state: CheckboxState.Half,
  //               locked: shouldLock(yesterday)
  //             },
  //             {
  //               key: today,
  //               onClick: ()=>{console.log("try to update", today)},
  //               state: CheckboxState.Empty,
  //               locked: shouldLock(today)
  //             },
  //             {
  //               key: tomorrow,
  //               onClick: ()=>{console.log("try to update", tomorrow)},
  //               state: CheckboxState.Empty,
  //               locked: shouldLock(tomorrow)
  //             }
  //           ]
  //         },
  //         {
  //           title: "Cycling",
  //           values: [
  //             {
  //               key: yesterday,
  //               onClick: ()=>{console.log("try to update", yesterday)},
  //               state: CheckboxState.Full,
  //               locked: shouldLock(yesterday)
  //             },
  //             {
  //               key: today,
  //               onClick: ()=>{console.log("try to update", today)},
  //               state: CheckboxState.Empty,
  //               locked: shouldLock(today)
  //             },
  //             {
  //               key: tomorrow,
  //               onClick: ()=>{console.log("try to update", tomorrow)},
  //               state: CheckboxState.Empty,
  //               locked: shouldLock(tomorrow)
  //             }
  //           ]
  //         }
  //       ],
  //     }
  //   ]
  // } as ITableProps)

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
    {<Table {...tableProps}/>}
  </>;
}




//////// EXAMPLE JSON AND TYPES


const jsonData = `{
  "title":"Habits of Sam", 
  "categories": [
    {
      "title":"Exercise",
      "habits": [
        {
          "title":"Running",
          "activities":[{"date":100, "value":2}, {"date":101, "value":1}, {"date":102, "value":0}]
        }
      ]
    }
  ]
}`

interface IThinger {
  title:string,
  categories: ICategory[],
}

interface ICategory{
  title: string,
  habits: IHabit[],
}

interface IHabit{
  title: string,
  activities: IActivity[]
}

interface IActivity{
  date: number,
  value: number
}

const bob: IThinger = JSON.parse(jsonData)

console.log(bob)

console.log(bob.categories[0].title)