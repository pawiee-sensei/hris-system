import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../api/authApi";
import useAuth from "../../hooks/useAuth";
import getErrorMessage from "../../utils/getErrorMessage";
import AuthLayout from "./AuthLayout";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await loginUser({ email, password });
            login(response.data.token, response.data.user);
            navigate("/dashboard");
        } catch (err) {
            setError(getErrorMessage(err, "Login failed"));
        }
    };

    return (
        <AuthLayout>
            <h1>Login</h1>

            {error && <p className="auth-error">{error}</p>}

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

                <button type="submit">Log In</button>
            </form>

            <Link to="/forgot-password">Forgot password?</Link>
            <Link to="/register">Don't have an account? Register</Link>
        </AuthLayout>
    );
};

export default Login;