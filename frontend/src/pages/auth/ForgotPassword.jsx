import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../api/authApi";

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
            setError(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div>
            <h1>Forgot Password</h1>

            {error && <p>{error}</p>}

            {submitted ? (
                <p>If that email exists, a reset link has been sent. Check your inbox.</p>
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
        </div>
    );
};

export default ForgotPassword;