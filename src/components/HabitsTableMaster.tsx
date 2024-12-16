import { User } from "@firebase/auth";
import { IHabits } from "../types/habits";
import { IUser } from "../pages/Landing";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
} from "@firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { db } from "../firebase";
import Habits from "./Habits";

export interface IHabitsTableMasterProps {
    // habitsDoc: IHabits,
    // userDoc: IUser,
    user: User;
}

export default function HabitsTableMaster(props: IHabitsTableMasterProps) {
    const habitsCollection = collection(db, "habits");
    const userCollection = collection(db, "habitusers");

    const [userDoc, setUserDoc] = useState<IUser>();
    const [habits, setHabits] = useState<IHabits>();
    const [needToStart, setNeedToStart] = useState<boolean>(false);

    const getStarted = useCallback(
        (user_id: string) => {
            if (user_id == "") {
                console.log("failed to get started as no user id");
                return;
            }
            // TODO check that we don't already have one...
            // we have a user id, so we need to:
            // 1. create a new habits doc
            // 2. create a new userhabits doc
            //      a. with the new habits doc in there
            const blankHabits: IHabits = {
                title: "Your Habits",
                categories: [],
            };
            addDoc(habitsCollection, blankHabits)
                .then((newHabits) => {
                    const habitsId = newHabits.id;
                    const newUserDocRef = doc(userCollection, user_id);
                    const newUserDoc: IUser = {
                        habits_id: habitsId,
                    };

                    setHabits(blankHabits);
                    setUserDoc(newUserDoc);

                    return setDoc(newUserDocRef, newUserDoc);
                })
                .catch((e) => {
                    console.log("failed to set up new habits:", e);
                    throw "failed to add new habits doc";
                });
        },
        [habitsCollection, userCollection, setHabits, setUserDoc],
    );

    const loadUser = useCallback(() => {
        getDoc(doc(userCollection, props.user.uid))
            .then((userDoc) => {
                if (!userDoc.exists()) {
                    setUserDoc(undefined);
                    setNeedToStart(true);
                    return;
                }
                const userDocData: IUser = userDoc.data() as IUser;
                setUserDoc(userDocData);
                setNeedToStart(false);
            })
            .catch((e) => {
                console.log("failed to get user doc:", e);
            });
    }, [props.user, userCollection, setUserDoc, setNeedToStart]);

    const loadHabits = useCallback(() => {
        console.log("loading habits");
        if (userDoc) {
            console.log("getting the habits doc");
            getDoc(doc(habitsCollection, userDoc.habits_id))
                .then((habitsDoc) => {
                    if (!habitsDoc.exists()) {
                        setHabits(undefined);
                        return;
                    }
                    const data = habitsDoc.data();
                    const dataHabits: IHabits = {
                        title: habitsDoc.id,
                        categories: data.categories,
                    };
                    setHabits(dataHabits);
                })
                .catch((e) => {
                    console.log("failed to get habits doc:", e);
                });
        }
    }, [habitsCollection, userDoc]);

    const loadData = useCallback(() => {
        loadUser();
        loadHabits();
    }, [loadHabits, loadUser]);

    const updateHabits = useCallback(
        (newHabits: IHabits) => {
            updateDoc(doc(habitsCollection, userDoc?.habits_id), {
                ...newHabits,
            }).then(() => {
                loadData();
            });
        },
        [habitsCollection, loadData, userDoc?.habits_id],
    );

    // Todo we can solve lots of this by waiting for user to be not undefined efore rendering a child component
    // on first render
    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        loadHabits();
    }, [userDoc]);

    return (
        <>
            {habits ? (
                <Habits data={habits} updateHabits={updateHabits} />
            ) : needToStart ? (
                <button
                    onClick={() => {
                        getStarted(props.user.uid);
                    }}
                >
                    Get Started
                </button>
            ) : (
                <>loading habits...</>
            )}
        </>
    );
}
