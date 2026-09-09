import { useState } from "react";
import { grantLeaveBalance } from "../../api/leaveBalanceApi";
import getErrorMessage from "../../utils/getErrorMessage";

const LeaveBalanceGrant = () => {
    const [employeeId, setEmployeeId] = useState("");
    const [leaveType, setLeaveType] = useState("VACATION");
    const [totalCredits, setTotalCredits] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            const response = await grantLeaveBalance({ employeeId, leaveType, totalCredits });
            setMessage(response.message);
            setEmployeeId("");
            setTotalCredits("");
        } catch (err) {
            setError(getErrorMessage(err, "Failed to grant leave balance"));
        }
    };

    return (
        <div>
            <h1>Grant Leave Balance</h1>

            {error && <p>{error}</p>}
            {message && <p>{message}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Employee ID</label>
                    <input
                        type="number"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Leave Type</label>
                    <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                        <option value="SICK">Sick</option>
                        <option value="VACATION">Vacation</option>
                        <option value="EMERGENCY">Emergency</option>
                    </select>
                </div>

                <div>
                    <label>Total Credits</label>
                    <input
                        type="number"
                        value={totalCredits}
                        onChange={(e) => setTotalCredits(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Grant Balance</button>
            </form>
        </div>
    );
};

export default LeaveBalanceGrant;