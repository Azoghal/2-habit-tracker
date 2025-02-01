import { useUserAuth } from "../context/SessionHelpers";
import EHabitsTableMaster from "../components/experiment/EHabitsTableMaster";

function Experiment(): JSX.Element {
    const user = useUserAuth();

    return (
        <>
            <h1>Firebase Demo - Recipes</h1>
            <h2>{user?.email}</h2>
            {user ? <EHabitsTableMaster user={user} /> : <>loading user</>}
        </>
    );
}

export default Experiment;
