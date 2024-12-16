import { useUserAuth } from "../context/SessionHelpers";
import HabitsTableMaster from "../components/HabitsTableMaster";

export interface IUser {
    habits_id: string;
}

function Landing(): JSX.Element {
    const user = useUserAuth();

    return (
        <>
            <h1>Firebase Demo - Recipes</h1>
            <h2>{user?.email}</h2>
            {user ? <HabitsTableMaster user={user} /> : <>loading user</>}
        </>
    );
}

export default Landing;
