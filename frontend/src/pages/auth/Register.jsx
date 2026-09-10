import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../api/authApi";
import getErrorMessage from "../../utils/getErrorMessage";
import AuthLayout from "./AuthLayout";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await registerUser({ email, password });
            setSuccess(true);
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setError(getErrorMessage(err, "Registration failed"));
        }
    };

    return (
        <AuthLayout>
            <h1>Register</h1>

            {error && <p className="auth-error">{error}</p>}
            {success && <p className="auth-success">Account created! Redirecting to login...</p>}

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

                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Register</button>
            </form>

            <Link to="/login">Already have an account? Log in</Link>
        </AuthLayout>
    );
};

export default Register;