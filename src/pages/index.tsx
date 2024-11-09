import Habits, { getTodayMidday } from "@/components/Habits";
import { Convert, IHabits } from "@/types/habits";
import { useCallback, useEffect } from "react";
import { useCookies, CookiesProvider } from "react-cookie";

export default function Index() {
  const [cookies, setCookie] = useCookies(["habitsCookie"]);

  // TODO base64 this before we cookify it

  const setDefaultCookie = useCallback(() => {
    console.log("setting default cookie");
    setCookie(
      "habitsCookie",
      `{ "title":"Habits of Sam", 
      "categories": [
        {
          "title":"Exercise",
          "habits": [
            {
              "title":"Running",
              "activities":[${getTodayMidday()}]
            }
          ]
        }
      ]}`,
      { path: "/" }
    );
  }, [setCookie]);

  const setNewCookie = useCallback(
    (newHabits: IHabits) => {
      console.log("setting the new cookie", newHabits);
      const jsonData = Convert.habitsToJson(newHabits);
      console.log("convertdData", jsonData);
      setCookie("habitsCookie", jsonData, { path: "/" });
    },
    [setCookie]
  );

  useEffect(() => {
    if (!cookies.habitsCookie) {
      setDefaultCookie();
    }
  }, []);

  // TODO should do something to verify the type is right.
  return (
    <CookiesProvider>
      {cookies.habitsCookie ? (
        <Habits
          data={cookies.habitsCookie} // TODO this should be an IHabits instaed
          updateHabits={(newHabits) => {
            console.log("received new habis");
            setNewCookie(newHabits);
          }}
        />
      ) : (
        <button onClick={setDefaultCookie}>set cookie</button>
      )}
    </CookiesProvider>
  );
}
