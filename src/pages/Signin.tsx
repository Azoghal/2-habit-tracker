import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { auth } from "../firebase";

function Signup(): JSX.Element {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState<string>("");

    const login = useCallback(() => {
        signInWithEmailAndPassword(auth, email, password)
            .then((creds) => {
                const user = creds.user;
                console.log("logged in as", user);
                navigate("/landing");
            })
            .catch((error: Error) => {
                setErrorMsg(error.message);
            });
    }, [email, password, setErrorMsg, navigate]);

    const submit = useCallback(() => {
        if (email && password) {
            login();
        } else {
            setErrorMsg("Please enter email and password");
        }
    }, [email, login, password, setErrorMsg]);

    return (
        <>
            <h1> Firebase Demo </h1>
            {errorMsg && <p>{errorMsg}</p>}
            <input
                type="text"
                onChange={(e) => {
                    setEmail(e.target.value);
                }}
                placeholder="Email"
            />
            <input
                type="password"
                onChange={(e) => {
                    setPassword(e.target.value);
                }}
                placeholder="Password"
            />
            <button onClick={submit}>Submit</button>
        </>
    );
}

export default Signup;
