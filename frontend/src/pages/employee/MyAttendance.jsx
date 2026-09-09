import { useState, useEffect } from "react";
import { clockIn, clockOut, getMyAttendance } from "../../api/attendanceApi";
import { formatDate } from "../../utils/formatDate";
import getErrorMessage from "../../utils/getErrorMessage";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";

const MyAttendance = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadAttendance = async () => {
        try {
            const response = await getMyAttendance();
            setRecords(response.data);
        } catch (err) {
            setError(getErrorMessage(err, "Failed to load attendance"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAttendance();
    }, []);

    const handleClockIn = async () => {
        setError("");
        setMessage("");
        try {
            const response = await clockIn();
            setMessage(response.message);
            loadAttendance();
        } catch (err) {
            setError(getErrorMessage(err, "Clock in failed"));
        }
    };

    const handleClockOut = async () => {
        setError("");
        setMessage("");
        try {
            const response = await clockOut();
            setMessage(response.message);
            loadAttendance();
        } catch (err) {
            setError(getErrorMessage(err, "Clock out failed"));
        }
    };

    if (loading) return <Loader />;

    return (
        <div>
            <h1>My Attendance</h1>

            {error && <p>{error}</p>}
            {message && <p>{message}</p>}

            <button onClick={handleClockIn}>Clock In</button>
            <button onClick={handleClockOut}>Clock Out</button>

            {records.length === 0 ? (
                <EmptyState message="No attendance records yet" />
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Time In</th>
                            <th>Late (min)</th>
                            <th>Time Out</th>
                            <th>Undertime (min)</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((r) => (
                            <tr key={r.id}>
                                <td>{formatDate(r.date)}</td>
                                <td>{r.time_in || "-"}</td>
                                <td>{r.late_minutes}</td>
                                <td>{r.time_out || "-"}</td>
                                <td>{r.undertime_minutes}</td>
                                <td>{r.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MyAttendance;