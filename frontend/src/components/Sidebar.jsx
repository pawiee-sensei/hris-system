import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { isAdminOrHR } from "../utils/roleCheck";

const Sidebar = () => {
    const { user, logout } = useAuth();

    if (!user) {
        return null;
    }

    return (
        <nav>
            <div>
                <h3>HRIS</h3>
                <p>{user.email} ({user.role})</p>
            </div>

            <ul>
                <li><NavLink to="/dashboard">Dashboard</NavLink></li>
                <li><NavLink to="/profile">My Profile</NavLink></li>
                <li><NavLink to="/attendance">My Attendance</NavLink></li>
                <li><NavLink to="/leave">My Leave</NavLink></li>
                <li><NavLink to="/leave-balance">My Leave Balance</NavLink></li>
                <li><NavLink to="/announcements">Announcements</NavLink></li>
                <li><NavLink to="/change-password">Change Password</NavLink></li>

                {isAdminOrHR(user.role) && (
                    <>
                        <li><strong>Admin/HR</strong></li>
                        <li><NavLink to="/admin/employees">Employees</NavLink></li>
                        <li><NavLink to="/admin/departments">Departments</NavLink></li>
                        <li><NavLink to="/admin/leave-approvals">Leave Approvals</NavLink></li>
                        <li><NavLink to="/admin/leave-balance-grant">Grant Leave Balance</NavLink></li>
                        <li><NavLink to="/admin/announcements/create">Post Announcement</NavLink></li>
                    </>
                )}
            </ul>

            <button onClick={logout}>Logout</button>
        </nav>
    );
};

export default Sidebar;