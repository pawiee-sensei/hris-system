import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { isAdminOrHR } from "../../utils/roleCheck";
import { getMyAttendance } from "../../api/attendanceApi";
import { getMyLeaveBalances } from "../../api/leaveBalanceApi";
import { getAllAnnouncements } from "../../api/announcementApi";
import { getAllLeave } from "../../api/leaveApi";
import { getAllEmployees } from "../../api/employeeApi";
import { formatDate } from "../../utils/formatDate";
import Loader from "../../components/Loader";
import AttendanceCalendar from "../../components/AttendanceCalendar";

const Dashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [clockedInToday, setClockedInToday] = useState(false);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [balances, setBalances] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [employeeCount, setEmployeeCount] = useState(0);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const attendanceRes = await getMyAttendance();
                setAttendanceRecords(attendanceRes.data);
                const today = new Date().toISOString().slice(0, 10);
                const todayRecord = attendanceRes.data.find((r) => r.date === today);
                setClockedInToday(!!todayRecord);
            } catch (err) {
                // No employee profile — skip attendance widget silently.
            }

            try {
                const balanceRes = await getMyLeaveBalances();
                setBalances(balanceRes.data);
            } catch (err) {
                // Skip silently.
            }

            try {
                const announcementRes = await getAllAnnouncements();
                setAnnouncements(announcementRes.data.slice(0, 3));
            } catch (err) {
                // Skip silently.
            }

            if (isAdminOrHR(user.role)) {
                try {
                    const leaveRes = await getAllLeave();
                    setPendingCount(leaveRes.data.filter((l) => l.status === "PENDING").length);

                    const empRes = await getAllEmployees();
                    setEmployeeCount(empRes.data.length);
                } catch (err) {
                    // Skip silently.
                }
            }

            setLoading(false);
        };

        loadDashboard();
    }, [user.role]);

    if (loading) return <Loader />;

    return (
        <div>
            <h1>Welcome, {user.email}</h1>

            <section>
                <h2>Today's Attendance</h2>
                <p>{clockedInToday ? "You've clocked in today" : "You haven't clocked in today"}</p>
                {attendanceRecords.length > 0 && <AttendanceCalendar records={attendanceRecords} />}
            </section>

            {balances.length > 0 && (
                <section>
                    <h2>My Leave Balance</h2>
                    {balances.map((b) => (
                        <p key={b.id}>{b.leave_type}: {b.total_credits - b.used_credits} days left</p>
                    ))}
                </section>
            )}

            {isAdminOrHR(user.role) && (
                <section>
                    <h2>Admin/HR Overview</h2>
                    <p>Pending Leave Approvals: {pendingCount}</p>
                    <p>Total Employees: {employeeCount}</p>
                </section>
            )}

            <section>
                <h2>Recent Announcements</h2>
                {announcements.length === 0 ? (
                    <p>No announcements yet</p>
                ) : (
                    announcements.map((a) => (
                        <div key={a.id}>
                            <strong>{a.title}</strong>
                            <p>{a.message}</p>
                            <small>{formatDate(a.created_at)}</small>
                        </div>
                    ))
                )}
            </section>
        </div>
    );
};

export default Dashboard;