import { useState } from "react";
import { KeyRound } from "lucide-react";
import { changePassword } from "../../api/authApi";
import getErrorMessage from "../../utils/getErrorMessage";
import "./ChangePassword.css";

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await changePassword({ currentPassword, newPassword });
            setSuccess(response.message);
            setCurrentPassword("");
            setNewPassword("");
        } catch (err) {
            setError(getErrorMessage(err, "Failed to change password"));
        }
    };

    return (
        <div>
            <div className="pwd-header">
                <h1>Change Password</h1>
                <p>Update your account password to keep it secure</p>
            </div>

            <div className="pwd-card">
                <div className="pwd-card-header">
                    <div className="pwd-icon"><KeyRound size={18} /></div>
                    <h3>Password Settings</h3>
                </div>

                {error && <p className="pwd-error">{error}</p>}
                {success && <p className="pwd-success">{success}</p>}

                <form onSubmit={handleSubmit} className="pwd-form">
                    <div className="form-group">
                        <label>Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <p className="pwd-hint">Must be at least 8 characters</p>
                    </div>

                    <div className="form-actions">
                        <button type="submit">Change Password</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;