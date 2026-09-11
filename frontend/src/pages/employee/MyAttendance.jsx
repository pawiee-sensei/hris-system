import { useState, useEffect } from "react";
import { Clock, LogIn, LogOut } from "lucide-react";
import { clockIn, clockOut, getMyAttendance, getMyAttendanceHistory } from "../../api/attendanceApi";
import { formatDate } from "../../utils/formatDate";
import { formatTime } from "../../utils/formatTime";
import getErrorMessage from "../../utils/getErrorMessage";
import Loader from "../../components/Loader";
import AttendanceCalendar from "../../components/AttendanceCalendar";
import "./MyAttendance.css";

const MyAttendance = () => {
    const [allRecords, setAllRecords] = useState([]);
    const [historyRecords, setHistoryRecords] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const todayStr = new Date().toISOString().slice(0, 10);

    const loadAll = async () => {
        try {
            const response = await getMyAttendance();
            setAllRecords(response.data);
        } catch (err) {
            setError(getErrorMessage(err, "Failed to load attendance"));
        }
    };

    const loadHistory = async (page = 1) => {
        try {
            const response = await getMyAttendanceHistory(page, 8);
            setHistoryRecords(response.data);
            setPagination(response.pagination);
        } catch (err) {
            setError(getErrorMessage(err, "Failed to load history"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAll();
        loadHistory(1);
    }, []);

    const todayRecord = allRecords.find((r) => r.date === todayStr);

    const handleClockIn = async () => {
        setError("");
        setMessage("");
        try {
            const response = await clockIn();
            setMessage(response.message);
            loadAll();
            loadHistory(1);
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
            loadAll();
            loadHistory(1);
        } catch (err) {
            setError(getErrorMessage(err, "Clock out failed"));
        }
    };

    const getTotalHours = (record) => {
        if (!record.time_in || !record.time_out) return "-";
        const [inH, inM] = record.time_in.split(":").map(Number);
        const [outH, outM] = record.time_out.split(":").map(Number);
        const minutes = (outH * 60 + outM) - (inH * 60 + inM);
        if (minutes <= 0) return "-";
        return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
    };

    const getStatusBadge = (record) => {
        if (!record.time_in) return <span className="status-badge badge-gray">Weekend</span>;
        if (record.late_minutes > 0) return <span className="status-badge badge-amber">Late</span>;
        return <span className="status-badge badge-green">On Time</span>;
    };

    if (loading) return <Loader />;

    return (
        <div>
            <div className="attendance-header">
                <h1>My Attendance</h1>
                <p>Track your daily clock-in and clock-out records</p>
            </div>

            {error && <p className="attendance-error">{error}</p>}
            {message && <p className="attendance-success">{message}</p>}

            <div className="attendance-action-card">
                <div className="action-left">
                    <div className="action-icon"><Clock size={24} /></div>
                    <div>
                        <p className="action-label">Today's Status</p>
                        <h2>{todayRecord ? (todayRecord.time_out ? "Clocked out" : "Clocked in") : "Not clocked in yet"}</h2>
                        <p className="action-date">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}</p>
                    </div>
                </div>

                <div className="action-buttons">
                    <button className="btn-clock-in" onClick={handleClockIn} disabled={!!todayRecord}>
                        <LogIn size={16} /> Clock In
                    </button>
                    <button className="btn-clock-out" onClick={handleClockOut} disabled={!todayRecord || !!todayRecord?.time_out}>
                        <LogOut size={16} /> Clock Out
                    </button>
                </div>
            </div>

            <AttendanceCalendar records={allRecords} layout="split" />

            <div className="attendance-table-card">
                <h3>Attendance History</h3>

                <table className="attendance-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Time In</th>
                            <th>Late (min)</th>
                            <th>Time Out</th>
                            <th>Undertime (min)</th>
                            <th>Total Hours</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historyRecords.map((r) => (
                            <tr key={r.id}>
                                <td>{formatDate(r.date)}</td>
                                <td>{formatTime(r.time_in)}</td>
                                <td>{r.late_minutes}</td>
                                <td>{formatTime(r.time_out)}</td>
                                <td>{r.undertime_minutes}</td>
                                <td>{getTotalHours(r)}</td>
                                <td>{getStatusBadge(r)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="pagination">
                    <button
                        disabled={pagination.page <= 1}
                        onClick={() => loadHistory(pagination.page - 1)}
                    >Prev</button>

                    <span>Page {pagination.page} of {pagination.totalPages || 1}</span>

                    <button
                        disabled={pagination.page >= pagination.totalPages}
                        onClick={() => loadHistory(pagination.page + 1)}
                    >Next</button>
                </div>
            </div>
        </div>
    );
};

export default MyAttendance;