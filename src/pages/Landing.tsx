import EHabitsTableMaster from "../components/experiment/EHabitsTableMaster";
import { useUserAuth } from "../context/SessionHelpers";

function Landing(): JSX.Element {
    const user = useUserAuth();

    return (
        <>
            <h1>Firebase Demo - Recipes</h1>
            <h2>{user?.email}</h2>
            {user ? <EHabitsTableMaster user={user} /> : <>loading user</>}
        </>
    );
}

export default Landing;
