import { useState, useEffect } from "react";
import { fileLeave, getMyLeave } from "../../api/leaveApi";
import { formatDate } from "../../utils/formatDate";
import getErrorMessage from "../../utils/getErrorMessage";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";

const MyLeave = () => {
    const [records, setRecords] = useState([]);
    const [leaveType, setLeaveType] = useState("VACATION");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadLeave = async () => {
        try {
            const response = await getMyLeave();
            setRecords(response.data);
        } catch (err) {
            setError(getErrorMessage(err, "Failed to load leave history"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLeave();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            const response = await fileLeave({ leaveType, startDate, endDate, reason });
            setMessage(response.message);
            setStartDate("");
            setEndDate("");
            setReason("");
            loadLeave();
        } catch (err) {
            setError(getErrorMessage(err, "Failed to file leave"));
        }
    };

    if (loading) return <Loader />;

    return (
        <div>
            <h1>My Leave</h1>

            {error && <p>{error}</p>}
            {message && <p>{message}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Leave Type</label>
                    <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                        <option value="SICK">Sick</option>
                        <option value="VACATION">Vacation</option>
                        <option value="EMERGENCY">Emergency</option>
                    </select>
                </div>

                <div>
                    <label>Start Date</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                </div>

                <div>
                    <label>End Date</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                </div>

                <div>
                    <label>Reason</label>
                    <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} />
                </div>

                <button type="submit">File Leave</button>
            </form>

            <h2>My Leave History</h2>
            {records.length === 0 ? (
                <EmptyState message="No leave requests yet" />
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((r) => (
                            <tr key={r.id}>
                                <td>{r.leave_type}</td>
                                <td>{formatDate(r.start_date)}</td>
                                <td>{formatDate(r.end_date)}</td>
                                <td>{r.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MyLeave;