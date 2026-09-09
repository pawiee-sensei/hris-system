import { useState, useEffect } from "react";
import { getAllLeave, reviewLeave } from "../../api/leaveApi";
import { formatDate } from "../../utils/formatDate";
import getErrorMessage from "../../utils/getErrorMessage";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";

const LeaveApprovals = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadLeave = async () => {
        try {
            const response = await getAllLeave();
            setRecords(response.data);
        } catch (err) {
            setError(getErrorMessage(err, "Failed to load leave requests"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLeave();
    }, []);

    const handleReview = async (id, status) => {
        setError("");
        setMessage("");

        try {
            const response = await reviewLeave(id, status);
            setMessage(response.message);
            loadLeave();
        } catch (err) {
            setError(getErrorMessage(err, "Failed to review leave"));
        }
    };

    if (loading) return <Loader />;

    return (
        <div>
            <h1>Leave Approvals</h1>

            {error && <p>{error}</p>}
            {message && <p>{message}</p>}

            {records.length === 0 ? (
                <EmptyState message="No leave requests yet" />
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>Type</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((r) => (
                            <tr key={r.id}>
                                <td>{r.employee_id}</td>
                                <td>{r.leave_type}</td>
                                <td>{formatDate(r.start_date)}</td>
                                <td>{formatDate(r.end_date)}</td>
                                <td>{r.status}</td>
                                <td>
                                    {r.status === "PENDING" && (
                                        <>
                                            <button onClick={() => handleReview(r.id, "APPROVED")}>Approve</button>
                                            <button onClick={() => handleReview(r.id, "REJECTED")}>Reject</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default LeaveApprovals;