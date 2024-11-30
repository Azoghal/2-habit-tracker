import { useCallback, useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "@firebase/firestore";
import { useUserAuth } from "../context/SessionHelpers";
import Habits, { getTodayMidday } from "../components/Habits";
import { IHabits } from "../types/habits";

const placeholderHabits: IHabits = {
    title: "loading...",
    categories: [],
};

function Landing(): JSX.Element {
    // const navigate = useNavigate();
    const user = useUserAuth();

    // TODO fetch example
    const habitsCollection = collection(db, "habits");
    const [habits, setHabits] = useState<IHabits>(placeholderHabits);

    const loadData = useCallback(() => {
        // TODO change this to use the user id to get the doc
        getDocs(habitsCollection).then((rs) => {
            const doc = rs.docs[0];
            const data = doc.data();
            const hhhh: IHabits = {
                title: doc.id,
                categories: [
                    {
                        title: "Exercise",
                        habits: [
                            {
                                title: "Running",
                                activities: [
                                    { date: getTodayMidday(), value: 1 },
                                ],
                            },
                        ],
                    },
                ],
            };
            // console.log(data);
            console.log(hhhh);
            setHabits(hhhh);
        });
    }, [habitsCollection, setHabits]);

    useEffect(() => {
        loadData();
    }, []);

    return (
        <>
            <h1>Firebase Demo - Recipes</h1>
            <h2>{user?.email}</h2>
            <Habits data={habits} />
        </>
    );
}

export default Landing;
