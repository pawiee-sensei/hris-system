import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { isAdminOrHR } from "../utils/roleCheck";
import {
    LayoutDashboard,
    User,
    Clock,
    Calendar,
    Wallet,
    Megaphone,
    KeyRound,
    Users,
    Building2,
    ClipboardCheck,
    LogOut
} from "lucide-react";
import "./Sidebar.css";

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

            <ul className="sidebar-links">
                <li>
                    <NavLink to="/dashboard" className="sidebar-link">
                        <LayoutDashboard size={18} /> Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/profile" className="sidebar-link">
                        <User size={18} /> My Profile
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/attendance" className="sidebar-link">
                        <Clock size={18} /> My Attendance
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/leave" className="sidebar-link">
                        <Calendar size={18} /> My Leave
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/leave-balance" className="sidebar-link">
                        <Wallet size={18} /> My Leave Balance
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/announcements" className="sidebar-link">
                        <Megaphone size={18} /> Announcements
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/change-password" className="sidebar-link">
                        <KeyRound size={18} /> Change Password
                    </NavLink>
                </li>

                {isAdminOrHR(user.role) && (
                    <>
                        <li className="sidebar-section">Admin/HR</li>
                        <li>
                            <NavLink to="/admin/employees" className="sidebar-link">
                                <Users size={18} /> Employees
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/departments" className="sidebar-link">
                                <Building2 size={18} /> Departments
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/leave-approvals" className="sidebar-link">
                                <ClipboardCheck size={18} /> Leave Approvals
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/leave-balance-grant" className="sidebar-link">
                                <Wallet size={18} /> Grant Leave Balance
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/announcements/create" className="sidebar-link">
                                <Megaphone size={18} /> Post Announcement
                            </NavLink>
                        </li>
                    </>
                )}
            </ul>

            <button className="sidebar-logout" onClick={logout}>
                <LogOut size={18} /> Logout
            </button>
        </nav>
    );
};

export default Sidebar;