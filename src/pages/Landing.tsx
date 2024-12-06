import { useCallback, useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, doc, getDoc, updateDoc } from "@firebase/firestore";
import { useUserAuth } from "../context/SessionHelpers";
import Habits from "../components/Habits";
import { IHabits } from "../types/habits";

const placeholderHabits: IHabits = {
    title: "",
    categories: [],
};

interface IUser {
    habitsId: string;
}

const debugDoc = "zypiG4obgvl3T1Ja2gS2";

function Landing(): JSX.Element {
    const user = useUserAuth();
    const [userHabitId, setUserHabitId] = useState<string>();

    const habitsCollection = collection(db, "habits");
    const [habits, setHabits] = useState<IHabits>();

    const userCollection = collection(db, "users");

    const loadData = useCallback(() => {
        console.log("user uid:", user?.uid);
        if (!user?.uid) {
            return;
        }
        getDoc(doc(userCollection, user?.uid)).then((userDoc) => {
            if (userDoc.exists()) {
                if (userDoc.data().habitsId) {
                    console.log("user habits id", userDoc.data().habitsId);
                    setUserHabitId(userDoc.data().habitsId);
                    getDoc(doc(habitsCollection, userDoc.data().habitsId)).then(
                        (habitsDoc) => {
                            if (habitsDoc.exists()) {
                                const data = habitsDoc.data();
                                const hhhh: IHabits = {
                                    title: habitsDoc.id,
                                    categories: data.categories,
                                };
                                setHabits(hhhh);
                            } else {
                                // TODO in this case the user doc exists, and has a habitsId
                                console.log(
                                    "failed to fetch expected habits doc",
                                );
                            }
                        },
                    );
                } else {
                    console.log("no habitsId");
                    console.log(userDoc.data());
                }
            } else {
                console.log("failed to fetch user details");
                console.log(userDoc);
            }
        });
        // TODO change this to use the user id to get the doc
    }, [setHabits]);

    const updateHabits = useCallback(
        (newHabits: IHabits) => {
            updateDoc(doc(habitsCollection, userHabitId), {
                ...newHabits,
            }).then(() => {
                loadData();
            });
        },
        [habitsCollection, loadData],
    );

    useEffect(() => {
        loadData();
    }, []);

    return (
        <>
            <h1>Firebase Demo - Recipes</h1>
            <h2>{user?.email}</h2>
            <button onClick={loadData}>Quick load data</button>
            {habits && <Habits data={habits} updateHabits={updateHabits} />}
        </>
    );
}

export default Landing;
