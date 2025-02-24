import EHabitsTableMaster from "../components/experiment/EHabitsTableMaster";
import { useUserAuth } from "../context/SessionHelpers";

function Landing(): JSX.Element {
    const user = useUserAuth();

    return <>{user ? <EHabitsTableMaster user={user} /> : <>loading user</>}</>;
}

export default Landing;
