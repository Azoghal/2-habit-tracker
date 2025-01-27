import { User } from "@firebase/auth";
import { IHabits } from "../types/habits";
import { useCallback, useEffect, useState } from "react";
import Habits from "./Habits";
import {
    CreateHabitsUserResult,
    IUser,
    newUserClient as newUsersClient,
} from "../clients/users";
import { newHabitsClient } from "../clients/habits";
import { newExperiments } from "../clients/experimentHabits";

export interface IHabitsTableMasterProps {
    // habitsDoc: IHabits,
    // userDoc: IUser,
    user: User;
}

export default function HabitsTableMaster(props: IHabitsTableMasterProps) {
    const [userDoc, setUserDoc] = useState<IUser>();
    const [habits, setHabits] = useState<IHabits>();
    const [needToStart, setNeedToStart] = useState<boolean>(false);

    const getStarted = useCallback((user_id: string) => {
        newUsersClient()
            .createHabitsUser(user_id)
            .then((res: CreateHabitsUserResult) => {
                setHabits(res.habits);
                setUserDoc(res.user);
                setNeedToStart(false);
            });
    }, []);

    const loadUser = useCallback(() => {
        // TODO turn this into a users client method
        newUsersClient()
            .getUser(props.user.uid)
            .then((user: IUser) => {
                setUserDoc(user);
                setNeedToStart(false);
            })
            .catch((e) => {
                console.log("failed to get user: ", e);
                // TODO think of a better way to handle the getting started flow
                setNeedToStart(true);
            });
    }, [props.user.uid]);

    const loadHabits = useCallback(() => {
        const client = newHabitsClient();

        if (userDoc) {
            client.getHabits(userDoc.habits_id).then((res) => {
                setHabits(res);
            });
        } else {
            client.getHabitsForUser(props.user.uid).then((res) => {
                setHabits(res);
            });
        }
    }, [userDoc, setHabits, props.user]);

    const loadData = useCallback(() => {
        loadUser();
        loadHabits();
    }, [loadHabits, loadUser]);

    const updateHabits = useCallback(
        (newHabits: IHabits) => {
            if (!userDoc) {
                return;
            }
            newHabitsClient()
                .updateHabits(userDoc?.habits_id, newHabits)
                .then(() => {
                    loadData();
                })
                .catch((e) => {
                    console.log("failed to update habits:", e);
                });
        },
        [userDoc, loadData],
    );

    // Todo we can solve lots of this by waiting for user to be not undefined efore rendering a child component
    // on first render
    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        loadHabits();
    }, [userDoc]);

    const fetchExperimentUser = useCallback(() => {
        if (userDoc) {
            newExperiments().getFullUserDoc(userDoc?.user_id);
        } else {
            console.log("coulnd't fetch user");
        }
    }, [userDoc]);

    return (
        <>
            <div>
                <button onClick={fetchExperimentUser}>
                    fetch experiment user
                </button>
            </div>
            {userDoc && habits ? (
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
