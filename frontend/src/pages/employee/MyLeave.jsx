import { useState, useEffect } from "react";
import { CalendarPlus, History } from "lucide-react";
import { fileLeave, getMyLeave } from "../../api/leaveApi";
import { formatDate } from "../../utils/formatDate";
import getErrorMessage from "../../utils/getErrorMessage";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import "./MyLeave.css";

const MyLeave = () => {
    const [records, setRecords] = useState([]);
    const [leaveType, setLeaveType] = useState("");
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
            setLeaveType("");
            setStartDate("");
            setEndDate("");
            setReason("");
            loadLeave();
        } catch (err) {
            setError(getErrorMessage(err, "Failed to file leave"));
        }
    };

    const getStatusBadge = (status) => {
        const map = {
            PENDING: "badge-amber",
            APPROVED: "badge-green",
            REJECTED: "badge-red"
        };
        return <span className={`status-badge ${map[status]}`}>{status.charAt(0) + status.slice(1).toLowerCase()}</span>;
    };

    if (loading) return <Loader />;

    return (
        <div>
            <div className="leave-header">
                <h1>My Leave</h1>
                <p>Request time off and track your leave history</p>
            </div>

            {error && <p className="leave-error">{error}</p>}
            {message && <p className="leave-success">{message}</p>}

            <div className="leave-card">
                <div className="leave-card-header">
                    <div className="leave-icon icon-blue"><CalendarPlus size={18} /></div>
                    <h3>File a Leave Request</h3>
                </div>

                <form onSubmit={handleSubmit} className="leave-form">
                    <div className="form-group">
                        <label>Leave Type</label>
                        <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} required>
                            <option value="">Select leave type</option>
                            <option value="SICK">Sick</option>
                            <option value="VACATION">Vacation</option>
                            <option value="EMERGENCY">Emergency</option>
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Start Date</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                        </div>

                        <div className="form-group">
                            <label>End Date</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Reason <span className="optional">(Optional)</span></label>
                        <textarea
                            placeholder="e.g. Not feeling well, family matter, etc."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit">Submit Request</button>
                    </div>
                </form>
            </div>

            <div className="leave-card">
                <div className="leave-card-header">
                    <div className="leave-icon icon-purple"><History size={18} /></div>
                    <h3>My Leave History</h3>
                </div>

                {records.length === 0 ? (
                    <EmptyState message="No leave requests yet" />
                ) : (
                    <>
                        <table className="leave-table">
                            <thead>
                                <tr>
                                    <th>Leave Type</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((r) => (
                                    <tr key={r.id}>
                                        <td>{r.leave_type.charAt(0) + r.leave_type.slice(1).toLowerCase()}</td>
                                        <td>{formatDate(r.start_date)}</td>
                                        <td>{formatDate(r.end_date)}</td>
                                        <td>{r.reason || "-"}</td>
                                        <td>{getStatusBadge(r.status)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <p className="leave-count">Showing {records.length} of {records.length} requests</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default MyLeave;