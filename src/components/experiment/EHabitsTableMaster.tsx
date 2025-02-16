import { User } from "@firebase/auth";
import { useCallback, useEffect, useState } from "react";
import EHabits from "./EHabits";
import { IUser, newUserClient as newUsersClient } from "../../clients/users";
import { newExperiments } from "../../clients/experimentHabits";
import EGetStarted from "./EGetStarted";
import { P_EXPERIMENTS_USERS } from "../../clients/schema";

export interface IHabitsTableMasterProps {
    // habitsDoc: IHabits,
    // userDoc: IUser,
    user: User;
}

export default function EHabitsTableMaster(props: IHabitsTableMasterProps) {
    const [userDoc, setUserDoc] = useState<IUser>();
    const [needToStart, setNeedToStart] = useState<boolean>(false);

    const getStarted = useCallback((user_id: string) => {
        console.log("unimplimented, must create experiments user", user_id);
        // newUsersClient()
        //     .createHabitsUser(user_id)
        //     .then((res: CreateHabitsUserResult) => {
        //         setUserDoc(res.user);
        //         setNeedToStart(false);
        //     });
    }, []);

    const loadUser = useCallback(() => {
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

    const loadData = useCallback(() => {
        loadUser();
    }, [loadUser]);

    // Todo we can solve lots of this by waiting for user to be not undefined efore rendering a child component
    // on first render
    useEffect(() => {
        loadData();
    }, [loadData]);

    const fetchExperimentUser = useCallback(() => {
        if (userDoc) {
            newExperiments().getFullUserDoc(userDoc?.user_id);
        } else {
            console.log("coulnd't fetch user");
        }
    }, [userDoc]);

    const fetchExperimentUser2 = useCallback(() => {
        if (userDoc) {
            newExperiments().getFullUserDoc2(userDoc?.user_id);
        } else {
            console.log("coulnd't fetch user");
        }
    }, [userDoc]);

    return (
        <>
            <div>
                <button onClick={fetchExperimentUser}>
                    fetch experiment user full
                </button>
                <button onClick={fetchExperimentUser2}>
                    fetch experiment user 2
                </button>
            </div>
            {userDoc ? (
                <EHabits
                    title={userDoc.display_name + "'s Habits"}
                    path={P_EXPERIMENTS_USERS + "/" + userDoc?.user_id}
                />
            ) : needToStart ? (
                <EGetStarted onClick={() => getStarted(props.user.uid)} />
            ) : (
                <>loading...</>
            )}
        </>
    );
}
