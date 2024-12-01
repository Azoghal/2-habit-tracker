import { useCallback, useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "@firebase/firestore";
import { useUserAuth } from "../context/SessionHelpers";
import Habits from "../components/Habits";
import { IHabits } from "../types/habits";

const placeholderHabits: IHabits = {
    title: "loading...",
    categories: [],
};

const debugDoc = "zypiG4obgvl3T1Ja2gS2";

function Landing(): JSX.Element {
    const user = useUserAuth();

    const habitsDocRef = doc(db, "habits", debugDoc);
    const [habits, setHabits] = useState<IHabits>(placeholderHabits);

    const loadData = useCallback(() => {
        // TODO change this to use the user id to get the doc
        getDoc(habitsDocRef).then((doc) => {
            if (doc.exists()) {
                const data = doc.data();
                const hhhh: IHabits = {
                    title: doc.id,
                    categories: data.categories,
                };
                setHabits(hhhh);
            } else {
                console.log("failed to fetch doc");
            }
        });
    }, [setHabits, habitsDocRef]);

    const updateHabits = useCallback(
        (newHabits: IHabits) => {
            updateDoc(habitsDocRef, { ...newHabits }).then(() => {
                loadData();
            });
        },
        [habitsDocRef, loadData],
    );

    useEffect(() => {
        loadData();
    }, []);

    return (
        <>
            <h1>Firebase Demo - Recipes</h1>
            <h2>{user?.email}</h2>
            <Habits data={habits} updateHabits={updateHabits} />
        </>
    );
}

export default Landing;
