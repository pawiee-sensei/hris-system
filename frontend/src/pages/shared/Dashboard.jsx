import { useState, useEffect } from "react";
import { CalendarCheck, Umbrella, ClipboardList, Users, Megaphone } from "lucide-react";
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
import "./Dashboard.css";

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
                // No employee profile — skip attendance widgets silently.
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

    const totalLeaveLeft = balances.reduce((sum, b) => sum + (b.total_credits - b.used_credits), 0);

    return (
        <div className="dashboard">
            <div className="dash-header">
                <h1>Welcome, {user.email}</h1>
                <p>Here's what's happening with your account today.</p>
            </div>

            <div className="dash-metrics">
                <div className="metric-card">
                    <div className="metric-icon icon-green"><CalendarCheck size={20} /></div>
                    <p className="metric-label">Today's Attendance</p>
                    <p className="metric-value">{clockedInToday ? "Clocked In" : "Not Clocked In"}</p>
                </div>

                <div className="metric-card">
                    <div className="metric-icon icon-blue"><Umbrella size={20} /></div>
                    <p className="metric-label">Leave Balance</p>
                    <p className="metric-value">{totalLeaveLeft} days left</p>
                </div>

                {isAdminOrHR(user.role) && (
                    <>
                        <div className="metric-card">
                            <div className="metric-icon icon-amber"><ClipboardList size={20} /></div>
                            <p className="metric-label">Pending Approvals</p>
                            <p className="metric-value">{pendingCount}</p>
                        </div>

                        <div className="metric-card">
                            <div className="metric-icon icon-purple"><Users size={20} /></div>
                            <p className="metric-label">Total Employees</p>
                            <p className="metric-value">{employeeCount}</p>
                        </div>
                    </>
                )}
            </div>

            <div className="dash-columns">
                <div className="dash-main">
                    <div className="dash-card">
                        <div className="dash-card-header">
                            <Megaphone size={20} className="text-primary" />
                            <div>
                                <h3>Recent Announcements</h3>
                                <p>Stay updated with the latest news from HR</p>
                            </div>
                        </div>

                        {announcements.length === 0 ? (
                            <p className="dash-empty">No announcements yet</p>
                        ) : (
                            announcements.map((a) => (
                                <div key={a.id} className="announcement-item">
                                    <p className="announcement-title">{a.title}</p>
                                    <p className="announcement-message">{a.message}</p>
                                    <p className="announcement-date">{formatDate(a.created_at)}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="dash-side">
                    {attendanceRecords.length > 0 && (
                        <AttendanceCalendar records={attendanceRecords} />
                    )}

                    <div className="dash-card">
                        <h3>Today's Summary</h3>
                        <div className="summary-row">
                            <span>Attendance</span>
                            <span className={`summary-badge ${clockedInToday ? "badge-green" : "badge-gray"}`}>
                                {clockedInToday ? "Clocked In" : "Not Yet"}
                            </span>
                        </div>
                        <div className="summary-row">
                            <span>Leave Balance</span>
                            <span className="summary-badge badge-blue">{totalLeaveLeft} days</span>
                        </div>
                        <div className="summary-row">
                            <span>Announcements</span>
                            <span className="summary-badge badge-purple">{announcements.length} recent</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;