import { Box } from "@/components/Box";
import Habits, { YEAR_MILLIS } from "@/components/Habits";
import { Convert, IHabits } from "@/types/habits";
import { useEffect, useMemo } from "react";
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
  // TODO base64 it when we cookify it
  const [cookies, setCookie] = useCookies(["habitsCookie"]);

  // on load, if we have no cookie, then set up the default one
  // if we have one, populate our state
  useEffect(() => {
    if (!cookies.habitsCookie) {
      setCookie("habitsCookie", defaultHabitJson, {
        path: "/",
        expires: new Date(Date.now() + YEAR_MILLIS),
      });
      return;
    }
  }, []);

  // TODO think about moving this down into the habits chap... maybe
  const habitData = useMemo(() => {
    return cookies.habitsCookie;
  }, [cookies.habitsCookie]);

  // TODO should do something to verify the type is right.
  return (
    <CookiesProvider>
      {habitData && (
        <Habits
          data={habitData} // TODO this should be an IHabits instaed
        />
      )}
    </CookiesProvider>
  );
}
