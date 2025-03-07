import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { auth } from "../firebase";

function Signin(): JSX.Element {
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
            .catch(() => {
                setErrorMsg("Oops! That didn't look right. Try again");
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
        <div className="c-signin-container">
            <div className="c-signin-box">
                <h1> Habit Tracker </h1>

                <h3>
                    Sign in (<a href="/signup">or Sign up</a>){" "}
                </h3>
                {errorMsg && <p>{errorMsg}</p>}

                <div className="c-signin-form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        className="input"
                        type="email"
                        id="email"
                        name="email"
                        required
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                </div>
                <div className="c-signin-form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        className="input"
                        type="password"
                        id="password"
                        name="password"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        required
                    />
                </div>
                <button className="c-btn" onClick={submit}>
                    Submit
                </button>
            </div>
        </div>
    );
}

export default Signin;
