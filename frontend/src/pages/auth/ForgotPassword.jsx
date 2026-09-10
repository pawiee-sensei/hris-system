import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../api/authApi";
import getErrorMessage from "../../utils/getErrorMessage";
import AuthLayout from "./AuthLayout";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await forgotPassword(email);
            setSubmitted(true);
        } catch (err) {
            setError(getErrorMessage(err, "Something went wrong"));
        }
    };

    return (
        <AuthLayout>
            <h1>Forgot Password</h1>

            {error && <p className="auth-error">{error}</p>}

            {submitted ? (
                <p className="auth-success">If that email exists, a reset link has been sent. Check your inbox.</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit">Send Reset Link</button>
                </form>
            )}

            <Link to="/login">Back to login</Link>
        </AuthLayout>
    );
};

export default ForgotPassword;