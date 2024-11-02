import { ICategoryProps } from "@/components/Category";
import { CheckboxState, CheckboxStateFromInt, ICheckboxProps } from "@/components/Checkbox";
import { IRowProps } from "@/components/Row";
import Table, { ITableProps } from "@/components/Table";
import { Convert, IHabits } from "@/types/habits";
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

// const jsonRep = `{"title": "Habits of Sam", "categories": [{"title":"Exercise","habits":}]}`


export default function Index() {

  const daySeconds = 86400;
  const today = getTodayMidday();
  const yesterday = today - daySeconds; // TODO remove eventually, just for hardcoding
  const tomorrow = today + daySeconds;


const jsonData = `{
  "title":"Habits of Sam", 
  "categories": [
    {
      "title":"Exercise",
      "habits": [
        {
          "title":"Running",
          "activities":[{"date":${yesterday}, "value":2}, {"date":${today}, "value":1}, {"date":${tomorrow}, "value":0}]
        }
      ]
    }
  ]
}`

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

  const [habits, setHabits] = useState<ITableProps>();

  const loadData = useCallback(()=>{
    setHabits(enrichHabits(Convert.toHabits(jsonData), currentDate, lockFuture, lockPast))
  }, [])

  useEffect(()=>{
    loadData()
  },[])

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
    {habits && <Table {...habits}/>}
  </>;
}

function enrichHabits(table: IHabits, today: number, lockForwards: boolean, lockBackwards: boolean): ITableProps {
  const categories: ICategoryProps[] = table.categories.map((c)=>{
    const habits: IRowProps[] = c.habits.map((h)=>{
      const activities: ICheckboxProps[] = h.activities.map((a)=>{
        console.log(a.date, today)
        const activity:ICheckboxProps = {
          ...a,
          state: CheckboxStateFromInt(a.value),
          // locked: false,
          locked: (a.date < today && lockBackwards) || (a.date > today && lockForwards),
          onClick: ()=>{},
        }
        return activity
      })
      const row: IRowProps = {title: h.title, habit: activities}
      return row
    })
    const category: ICategoryProps = {title: c.title, habits: habits}
    return category
  })

  const res: ITableProps = {
    title: table.title,
    categories: categories,
  }
  return res
}

