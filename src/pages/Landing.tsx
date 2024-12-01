import { useCallback, useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "@firebase/firestore";
import { useUserAuth } from "../context/SessionHelpers";
import Habits from "../components/Habits";
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
            // TODO temporary measure to get the current doc
            const doc = rs.docs.filter((d) => {
                return d.id == "zypiG4obgvl3T1Ja2gS2";
            })[0];
            const data = doc.data();
            const hhhh: IHabits = {
                title: doc.id,
                categories: data.categories,
            };
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
