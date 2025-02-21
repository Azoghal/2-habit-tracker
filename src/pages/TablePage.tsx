import { TablePractice } from "../components/tablePractice/TablePractice";
import { useUserAuth } from "../context/SessionHelpers";

export default function TablePage(): JSX.Element {
    const user = useUserAuth();

    return (
        <>
            <h1>Firebase Demo - Recipes</h1>
            <h2>{user?.email}</h2>
            <TablePractice columnKeys={[]} />
        </>
    );
}
