import { ICategoryProps } from "@/components/Category";
import { CheckboxState, CheckboxStateFromInt, ICheckboxProps } from "@/components/Checkbox";
import Habits from "@/components/Habits";
import { IRowProps } from "@/components/Row";
import Table, { ITableProps } from "@/components/Table";
import { Convert, IActivity, ICategory, IHabit, IHabits } from "@/types/habits";
import { useCallback, useEffect, useState } from "react";
import { useCookies, CookiesProvider } from "react-cookie";



export default function Index() {

  const [cookies, setCookie] = useCookies(['habitsCookie'])

  const setDefaultCookie = useCallback(()=>{
    conseol.log("setting default cookie")
    setCookie("habitsCookie", `{ "title":"Habits of Sam", 
      "categories": [
        {
          "title":"Exercise",
          "habits": [
            {
              "title":"Running",
              "activities":[]
            }
          ]
        }
      ]}`, {path: "/"})
  }, [setCookie])

  useEffect(()=>{
    if (!cookies.habitsCookie) {
      console.log("setting cookie use effect")
      setDefaultCookie()
    }
  }, [])

  return <CookiesProvider>
    <>hasCookie:{cookies.habitsCookie == undefined ? "yes" : "no"}</>
    <button onClick={setDefaultCookie}>set cookie</button>
    <Habits/>
  </CookiesProvider>;
}