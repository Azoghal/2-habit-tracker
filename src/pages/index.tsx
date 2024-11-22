import Habits, { YEAR_MILLIS } from "@/components/Habits";
import { Convert, IHabits } from "@/types/habits";
import { useEffect, useMemo, useState } from "react";
import { useCookies, CookiesProvider } from "react-cookie";

import { StyledFirebaseAuth } from "react-firebaseui";
import { firebaseApp, firebaseAuth } from "../firebase";

import { GoogleAuthProvider } from "firebase/auth";

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  signInOptions: [GoogleAuthProvider.PROVIDER_ID],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

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
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebaseAuth.onAuthStateChanged((user) => {
      setIsSignedIn(!!user);
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

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
      {isSignedIn ? (
        <div>
          <p>
            Welcome {firebaseAuth.currentUser?.displayName ?? "Undefined Name"}!
            You are now signed-in!
          </p>
          <a onClick={() => firebaseAuth.signOut()}>Sign-out</a>
        </div>
      ) : (
        <div>
          <p>Please sign-in:</p>
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseAuth} />
        </div>
      )}
      {habitData && (
        <Habits
          data={habitData} // TODO this should be an IHabits instaed
        />
      )}
    </CookiesProvider>
  );
}
