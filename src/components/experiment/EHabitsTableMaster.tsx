import { User } from "@firebase/auth";
import { useCallback, useEffect, useState } from "react";
import EHabits from "./EHabits";
import { IUser, newUserClient as newUsersClient } from "../../clients/users";
import EGetStarted from "./EGetStarted";
import { P_EXPERIMENTS_USERS } from "../../clients/schema";
import { TableSettingsProvider } from "../../context/TableSettings";

export interface IHabitsTableMasterProps {
    user: User;
}

export default function EHabitsTableMaster(props: IHabitsTableMasterProps) {
    const [newUserName, setNewUserName] = useState("");
    const [userDoc, setUserDoc] = useState<IUser>();
    const [needToStart, setNeedToStart] = useState<boolean>(false);

    const getStarted = useCallback(
        (user_id: string) => {
            if (newUserName.length > 0 && newUserName.length < 60) {
                newUsersClient()
                    .createUser({ display_name: newUserName, user_id: user_id })
                    .then((res: IUser) => {
                        setUserDoc(res);
                        setNeedToStart(false);
                    });
            }
        },
        [newUserName],
    );

    // Todo we can solve lots of this by waiting for user to be not undefined efore rendering a child component
    // on first render
    useEffect(() => {
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

    return (
        <>
            {userDoc ? (
                <TableSettingsProvider
                    initialSettings={{
                        lockFuture: true,
                        lockPast: false,
                        deleteHeaderMode: false,
                        addHeaderMode: false,
                    }}
                >
                    <EHabits
                        title={userDoc.display_name + "'s Habits"}
                        path={P_EXPERIMENTS_USERS + "/" + userDoc?.user_id}
                    />
                </TableSettingsProvider>
            ) : needToStart ? (
                // TODO add a username entry
                <div className="c-signin-container">
                    <div className="c-signin-box">
                        <input
                            className="c-input"
                            placeholder="username"
                            onChange={(e) => {
                                setNewUserName(e.target.value);
                            }}
                        />
                        <EGetStarted
                            onClick={() => {
                                getStarted(props.user.uid);
                            }}
                        />
                    </div>
                </div>
            ) : (
                <>loading...</>
            )}
        </>
    );
}
