import { Search, Bell } from "lucide-react";
import useAuth from "../hooks/useAuth";
import "./Navbar.css";

const Navbar = () => {
    const { user } = useAuth();

    return (
        <div className="navbar">
            <div className="navbar-search">
                <Search size={18} />
                <input type="text" placeholder="Search employees, departments, or anything..." />
            </div>

            <div className="navbar-right">
                <button className="navbar-bell"><Bell size={20} /></button>

                <div className="navbar-user">
                    <div className="navbar-avatar">{user.email.charAt(0).toUpperCase()}</div>
                    <div>
                        <p className="navbar-name">{user.email.split("@")[0]}</p>
                        <p className="navbar-email">{user.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;