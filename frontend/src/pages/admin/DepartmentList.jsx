import { useState, useEffect } from "react";
import { createDepartment, getAllDepartments } from "../../api/departmentApi";
import getErrorMessage from "../../utils/getErrorMessage";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";

const DepartmentList = () => {
    const [departments, setDepartments] = useState([]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadDepartments = async () => {
        try {
            const response = await getAllDepartments();
            setDepartments(response.data);
        } catch (err) {
            setError(getErrorMessage(err, "Failed to load departments"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDepartments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            const response = await createDepartment(name);
            setMessage(response.message);
            setName("");
            loadDepartments();
        } catch (err) {
            setError(getErrorMessage(err, "Failed to create department"));
        }
    };

    if (loading) return <Loader />;

    return (
        <div>
            <h1>Departments</h1>

            {error && <p>{error}</p>}
            {message && <p>{message}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Department Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <button type="submit">Add Department</button>
            </form>

            {departments.length === 0 ? (
                <EmptyState message="No departments yet" />
            ) : (
                <ul>
                    {departments.map((d) => (
                        <li key={d.id}>{d.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DepartmentList;