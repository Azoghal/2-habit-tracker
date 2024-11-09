import Habits, { getTodayMidday } from "@/components/Habits";
import { useCallback, useEffect } from "react";
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
              "activities":[${getTodayMidday()}]
            }
          ]
        }
      ]}`,
      { path: "/" }
    );
  }, [setCookie]);

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
          data={cookies.habitsCookie}
          updateHabits={() => {
            console.log("doing nothing");
          }}
        />
      ) : (
        <button onClick={setDefaultCookie}>set cookie</button>
      )}
    </CookiesProvider>
  );
}
