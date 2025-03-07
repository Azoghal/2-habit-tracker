import { useCallback, useState } from "react";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    User,
} from "@firebase/auth";
import { auth } from "../firebase";

function Signup(): JSX.Element {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [emailSent, setEmailSent] = useState(false);

    const [errorMsg, setErrorMsg] = useState<string>("");

    const sendVerificationEmail = useCallback((user: User) => {
        sendEmailVerification(user).then(() => {
            // Email verification sent!
            console.log("Verification email sent.");
            // Optionally, display a message to the user to check their email.
        });
        setEmailSent(true);
    }, []);

    const signUp = useCallback(
        (email: string, password: string) => {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    setErrorMsg("");
                    // Signed in
                    const user = userCredential.user;
                    sendVerificationEmail(user);
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error("Sign-up error:", errorCode, errorMessage);
                    setErrorMsg("Sign-up error: " + errorCode + errorMessage);
                    // Handle errors (e.g., display an error message to the user)
                });
        },
        [sendVerificationEmail],
    );

    const submit = useCallback(() => {
        if (password.length < 12 || repeatPassword.length < 12) {
            setErrorMsg("passwords must be a minimum of 12 characters");
            return;
        }
        if (password != repeatPassword) {
            setErrorMsg("passwords do not match");
            return;
        }
        signUp(email, password);
    }, [email, password, repeatPassword, signUp]);

    return (
        <div className="c-signin-container">
            <div className="c-signin-box">
                <h1> Habit Tracker </h1>
                <h3> Sign up </h3>
                {errorMsg && <p>{errorMsg}</p>}
                {emailSent && (
                    <p className="c-signin-form-group">
                        We've sent you a verification email. Please follow the
                        instructions there to finalize your account creation.
                    </p>
                )}
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
                        readOnly={emailSent}
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
                        disabled={emailSent}
                    />
                </div>
                <div className="c-signin-form-group">
                    <label htmlFor="password">Repeat Password</label>
                    <input
                        className="input"
                        type="password"
                        id="repeat-password"
                        name="repeat-password"
                        onChange={(e) => {
                            setRepeatPassword(e.target.value);
                        }}
                        required
                        disabled={emailSent}
                    />
                </div>
                <button className="c-btn" onClick={submit} disabled={emailSent}>
                    Create Account
                </button>
            </div>
        </div>
    );
}

export default Signup;
