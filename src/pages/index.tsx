import { ICategoryProps } from "@/components/Category";
import {
  CheckboxState,
  CheckboxStateFromInt,
  ICheckboxProps,
} from "@/components/Checkbox";
import Habits from "@/components/Habits";
import { IRowProps } from "@/components/Row";
import Table, { ITableProps } from "@/components/Table";
import { Convert, IActivity, ICategory, IHabit, IHabits } from "@/types/habits";
import { useCallback, useEffect, useState } from "react";
import { useCookies, CookiesProvider } from "react-cookie";

export default function Index() {
  const [cookies, setCookie] = useCookies(["habitsCookie"]);

  // TODO base64 this before we cookify it

  const setDefaultCookie = useCallback(() => {
    setCookie(
      "habitsCookie",
      `{ "title":"Habits of Sam", 
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
      ]}`,
      { path: "/" },
    );
  }, [setCookie]);

  useEffect(() => {
    if (!cookies.habitsCookie) {
      console.log("setting cookie use effect");
      setDefaultCookie();
    }
  }, []);

  // TODO should do something to verify the type is right.
  return (
    <CookiesProvider>
      {cookies.habitsCookie ? (
        <Habits
          data={cookies.habitsCookie}
          updateHabits={() => {
            console.log("doing a thing");
          }}
        />
      ) : (
        <button onClick={setDefaultCookie}>set cookie</button>
      )}
    </CookiesProvider>
  );
}
