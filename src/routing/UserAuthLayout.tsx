import { Outlet } from "react-router-dom";
import { UserAuthProvider } from "../context/Session";

const UserAuthLayout = () => {
    return (
        <UserAuthProvider>
            <Outlet />
        </UserAuthProvider>
    );
};

export default UserAuthLayout;
