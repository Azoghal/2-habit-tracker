import { useCallback, useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, doc, getDoc, updateDoc } from "@firebase/firestore";
import { useUserAuth } from "../context/SessionHelpers";
import Habits from "../components/Habits";
import { IHabits } from "../types/habits";

interface IUser {
    habits_id: string;
}

function Landing(): JSX.Element {
    const user = useUserAuth();
    const [userHabitId, setUserHabitId] = useState<string>();

    const habitsCollection = collection(db, "habits");
    const [habits, setHabits] = useState<IHabits>();

    const userCollection = collection(db, "habitusers");

    const loadData = useCallback(() => {
        console.log("user uid:", user?.uid);
        if (!user?.uid) {
            return;
        }
        getDoc(doc(userCollection, user?.uid))
            .then((userDoc) => {
                if (!userDoc.exists()) {
                    return;
                }
                const userDocData: IUser = userDoc.data() as IUser;
                const habits_id = userDocData.habits_id;
                if (!habits_id) {
                    return;
                }

                console.log("user habits id", habits_id);
                setUserHabitId(userDoc.data().habitsId);
                getDoc(doc(habitsCollection, habits_id)).then((habitsDoc) => {
                    if (!habitsDoc.exists()) {
                        return;
                    }

                    const data = habitsDoc.data();
                    const hhhh: IHabits = {
                        title: habitsDoc.id,
                        categories: data.categories,
                    };
                    setHabits(hhhh);
                });
            })
            .catch((e) => {
                console.log(e);
            });
    }, [setUserHabitId, setHabits, habitsCollection, user, userCollection]);

    const updateHabits = useCallback(
        (newHabits: IHabits) => {
            updateDoc(doc(habitsCollection, userHabitId), {
                ...newHabits,
            }).then(() => {
                loadData();
            });
        },
        [habitsCollection, loadData, userHabitId],
    );

    useEffect(() => {
        loadData();
    }, []);

    return (
        <>
            <h1>Firebase Demo - Recipes</h1>
            <h2>{user?.email}</h2>
            {!!habits && <Habits data={habits} updateHabits={updateHabits} />}
        </>
    );
}

export default Landing;
