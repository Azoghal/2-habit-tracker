import Habits, { getTodayMidday } from "@/components/Habits";
import { Convert, IHabits } from "@/types/habits";
import { useCallback, useEffect, useState } from "react";
import { useCookies, CookiesProvider } from "react-cookie";

const defaultHabits: IHabits = {
  title: "Habits of Sam",
  categories: [
    {
      title: "Exercise",
      habits: [
        {
          title: "Running",
          activities: [],
        },
      ],
    },
  ],
};

const defaultHabitJson = Convert.habitsToJson(defaultHabits);

export default function Index() {
  const [cookies, setCookie] = useCookies(["habitsCookie"]);
  const [habitData, setHabitData] = useState<IHabits>();

  // on load, if we have no cookie, then set up the default one
  // if we have one, populate our state
  useEffect(() => {
    if (!cookies.habitsCookie) {
      setCookie("habitsCookie", defaultHabitJson, {
        path: "/",
        expires: new Date(Date.now() + 365 * 10 * 1000),
      });
      setHabitData(defaultHabits);
      return;
    }

    setHabitData(cookies.habitsCookie);
  }, []);

  // whenever habitData changes, update the cookie to reflect that
  useEffect(() => {
    if (habitData) {
      const jsonData = Convert.habitsToJson(habitData);
      setCookie("habitsCookie", jsonData, {
        path: "/",
        expires: new Date(Date.now() + 365 * 10 * 1000),
      });
    }
  }, [habitData, setCookie]);

  // TODO base64 this before we cookify it

  // TODO should do something to verify the type is right.
  return (
    <CookiesProvider>
      {habitData && (
        <Habits
          data={habitData} // TODO this should be an IHabits instaed
          updateHabits={setHabitData}
        />
      )}
    </CookiesProvider>
  );
}
