import { useState, useEffect } from "react";
import { getMyProfile, updateMyProfile } from "../../api/employeeApi";
import { getAllDepartments } from "../../api/departmentApi";
import { formatDate } from "../../utils/formatDate";
import getErrorMessage from "../../utils/getErrorMessage";
import Loader from "../../components/Loader";

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

    return (
        <div>
            <h1>My Profile</h1>

            {error && <p>{error}</p>}
            {success && <p>{success}</p>}

            <p>Employee Number: {profile.employee_number}</p>
            <p>Name: {profile.first_name} {profile.last_name}</p>
            <p>Department: {getDepartmentName(profile.department_id)}</p>
            <p>Position: {profile.position}</p>
            <p>Date Hired: {formatDate(profile.date_hired)}</p>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Phone</label>
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

                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export default MyProfile;