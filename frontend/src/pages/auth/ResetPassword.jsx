import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { resetPassword } from "../../api/authApi";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await resetPassword({ token, newPassword });
            setSuccess(true);
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            const validationErrors = err.response?.data?.errors;
            const message = validationErrors?.[0]?.message || err.response?.data?.message || "Reset failed";
            setError(message);
        }
    };

    return (
        <div>
            <h1>Reset Password</h1>

            {error && <p>{error}</p>}
            {success && <p>Password reset successfully. Redirecting to login...</p>}

            {!success && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit">Reset Password</button>
                </form>
            )}

            <Link to="/login">Back to login</Link>
        </div>
    );
};

export default ResetPassword;