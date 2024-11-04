import { ICategoryProps } from "@/components/Category";
import { CheckboxStateFromInt, ICheckboxProps } from "@/components/Checkbox";
import { IRowProps } from "@/components/Row";
import Table, { ITableProps } from "@/components/Table";
import { Convert, IActivity, ICategory, IHabit, IHabits } from "@/types/habits";
import { useCallback, useEffect, useState } from "react";

function getTodayMidday(){
    const now = new Date();
    now.setUTCHours(12, 0, 0, 0);
    return Math.floor(now.getTime()/1000);
}
  
  // const jsonRep = `{"title": "Habits of Sam", "categories": [{"title":"Exercise","habits":}]}`
  
  export default function Habits() {
  
    const daySeconds = 86400;
    const today = getTodayMidday();
    const yesterday = today - daySeconds; // TODO remove eventually, just for hardcoding
    const tomorrow = today + daySeconds;
  
    const [jsonData, setJsonData] = useState<string>(`{
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
    }`)
  
    const [currentDate, setCurrentDate] = useState(getTodayMidday());
    const [lockPast, setLockPast] = useState(true);
    const [lockFuture, setLockFuture] = useState(true);
  
    const [habits, setHabits] = useState<ITableProps>(enrichHabits(Convert.toHabits(jsonData), currentDate, lockFuture, lockPast));
  
    const loadData = useCallback(()=>{
      // TODO get the jsonData from cookie
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
      // TODO on load, we should check if cookie exists. If it does, pull from there, otherwise, initialise empty
      loadData()
    },[])
  
    // see if we can jsonify ITableProps directly
    const testThinger = useCallback(()=>{
      console.log("I'm going to jsonify ITableProps")
      if (habits == undefined) {
        console.log("no habits")
        return
      }
      const b  = Convert.habitsToJson(backToHabits(habits))
  
      console.log(b);
    }, [])
  
    return <>
      {/* <Checkbox state={checkState} onClick={updateCheck}/> */}
      <button className="" onClick={toggleLockPast}>{lockPast? "🔒":"🔓"} Past</button>
      <button onClick={toggleLockFuture}>{lockFuture?"🔒":"🔓"} Future</button>
      <button onClick={testThinger}>Press me</button>
      {/* <Row title={"Code"} values={[...allValues.values()]} onUpdateCheckbox={updateAValue} currentDay={today} lockPast={lockPast} lockFuture={lockFuture}/> */}
      {habits && <Table {...habits}/>}
    </>;
  }
  
  function enrichHabits(table: IHabits, today: number, lockForwards: boolean, lockBackwards: boolean): ITableProps {
    const categories: ICategoryProps[] = table.categories.map((c)=>{
      const habits: IRowProps[] = c.habits.map((h)=>{
        const activities: ICheckboxProps[] = h.activities.map((a)=>{
          const activity:ICheckboxProps = {
            ...a,
            state: CheckboxStateFromInt(a.value),
            // locked: false,
            locked: (a.date < today && lockBackwards) || (a.date > today && lockForwards),
            onClick: ()=>{},
          }
          return activity
        })
        const row: IRowProps = {title: h.title, activities: activities}
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
  
  function backToHabits(table: ITableProps): IHabits {
    const categories: ICategory[] = table.categories.map((c)=>{
      const habits: IHabit[] = c.habits.map((h)=>{
        const activities: IActivity[] = h.activities.map((a)=>{
          const activity:IActivity = {
            date: a.date,
            value: a.value,
          }
          return activity
        })
        const row: IHabit = {title: h.title, activities: activities}
        return row
      })
      const category: ICategory = {title: c.title, habits: habits}
      return category
    })
  
    const res: IHabits = {
      title: table.title,
      categories: categories,
    }
    return res
  }
  