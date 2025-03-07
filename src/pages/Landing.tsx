import { useCallback, useState } from "react";
import EHabitsTableMaster from "../components/experiment/EHabitsTableMaster";
import { useUserAuth } from "../context/SessionHelpers";
import { sendEmailVerification, User } from "@firebase/auth";

function Landing(): JSX.Element {
    const user = useUserAuth();

    if (!user) {
        return <>loading...</>;
    }

    if (!user.emailVerified) {
        return <VerifyEmail user={user} />;
    }

    return <>{user ? <EHabitsTableMaster user={user} /> : <>loading user</>}</>;
}

export default Landing;

interface VerifyEmailProps {
    user: User;
}

function VerifyEmail(props: VerifyEmailProps): JSX.Element {
    const [emailSent, setEmailSent] = useState(false);

    const sendVerificationEmail = useCallback(() => {
        sendEmailVerification(props.user).then(() => {
            setEmailSent(true);
        });
    }, [props.user]);

    return (
        <div className="c-signin-container">
            <div className="c-signin-box">
                <p className="c-signin-form-group">
                    You must verify your email to continue
                </p>
                {emailSent && (
                    <>
                        <p>Verification email sent.</p>
                        <p>
                            Please check your inbox and follow the instructions.
                        </p>
                    </>
                )}
                <button
                    className="c-btn"
                    onClick={sendVerificationEmail}
                    disabled={emailSent}
                >
                    Send verification email
                </button>
            </div>
        </div>
    );
}
