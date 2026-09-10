import { useState, useEffect } from "react";
import { getMyProfile, updateMyProfile } from "../../api/employeeApi";
import { getAllDepartments } from "../../api/departmentApi";
import { formatDate } from "../../utils/formatDate";
import getErrorMessage from "../../utils/getErrorMessage";
import Loader from "../../components/Loader";
import { User, Briefcase, Phone } from "lucide-react";
import "./MyProfile.css";

const MyProfile = () => {
    const [profile, setProfile] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [phone, setPhone] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadProfile = async () => {
        try {
            const response = await getMyProfile();
            setProfile(response.data);
            setPhone(response.data.phone || "");
            setBirthDate(response.data.birth_date || "");
        } catch (err) {
            setError(getErrorMessage(err, "Failed to load profile"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();

        const loadDepartments = async () => {
            try {
                const response = await getAllDepartments();
                setDepartments(response.data);
            } catch (err) {
                // Non-critical — profile still works without department names.
            }
        };
        loadDepartments();
    }, []);

    const getDepartmentName = (id) => {
        const dept = departments.find((d) => d.id === id);
        return dept ? dept.name : "-";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            await updateMyProfile({ phone, birthDate });
            setSuccess("Profile updated successfully");
            loadProfile();
        } catch (err) {
            setError(getErrorMessage(err, "Update failed"));
        }
    };

    if (loading) return <Loader />;

    if (error && !profile) {
        return (
            <div>
                <h1>My Profile</h1>
                <p>{error}</p>
            </div>
        );
    }

    const initials = `${profile.first_name?.charAt(0) || ""}${profile.last_name?.charAt(0) || ""}`;

    return (
        <div className="profile-page">
            <div className="profile-header">
                <h1>My Profile</h1>
                <p>View and update your personal information</p>
            </div>

            {error && <p className="profile-error">{error}</p>}
            {success && <p className="profile-success">{success}</p>}

            <div className="profile-card profile-hero">
                <div className="profile-card-header">
                    <div className="profile-icon icon-green"><User size={18} /></div>
                    <span className="profile-section-label">Profile Summary</span>
                </div>

                <div className="profile-summary">
                    <div className="profile-avatar">{initials}</div>
                    <div>
                        <h2>{profile.first_name} {profile.last_name}</h2>
                        <p className="profile-position">{profile.position}</p>
                        <span className="profile-status-badge">Active</span>
                    </div>
                </div>
            </div>

            <div className="profile-card">
                <div className="profile-card-header">
                    <div className="profile-icon icon-blue"><Briefcase size={18} /></div>
                    <span className="profile-section-label">Employment Details</span>
                </div>

                <div className="profile-grid">
                    <div>
                        <p className="field-label">Employee Number</p>
                        <p className="field-value">{profile.employee_number}</p>
                    </div>
                    <div>
                        <p className="field-label">Department</p>
                        <p className="field-value">{getDepartmentName(profile.department_id)}</p>
                    </div>
                    <div>
                        <p className="field-label">Position</p>
                        <p className="field-value">{profile.position}</p>
                    </div>
                    <div>
                        <p className="field-label">Date Hired</p>
                        <p className="field-value">{formatDate(profile.date_hired)}</p>
                    </div>
                </div>
            </div>

            <div className="profile-card">
                <div className="profile-card-header">
                    <div className="profile-icon icon-purple"><Phone size={18} /></div>
                    <span className="profile-section-label">Contact Information</span>
                </div>

                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="profile-grid">
                        <div>
                            <label>Phone Number</label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <div>
                            <label>Birth Date</label>
                            <input
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <button type="submit">Update Profile</button>
                </form>
            </div>
        </div>
    );
};

export default MyProfile;