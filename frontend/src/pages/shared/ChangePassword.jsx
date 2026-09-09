import { useState } from "react";
import { changePassword } from "../../api/authApi";
import getErrorMessage from "../../utils/getErrorMessage";

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
            <h1>Change Password</h1>

            {error && <p>{error}</p>}
            {success && <p>{success}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Current Password</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Change Password</button>
            </form>
        </div>
    );
};

export default ChangePassword;