import { useState, useEffect } from "react";
import { createEmployee, getAllEmployees } from "../../api/employeeApi";
import { getAllDepartments } from "../../api/departmentApi";
import { formatDate } from "../../utils/formatDate";
import getErrorMessage from "../../utils/getErrorMessage";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [form, setForm] = useState({
        userId: "",
        employeeNumber: "",
        firstName: "",
        lastName: "",
        phone: "",
        birthDate: "",
        departmentId: "",
        position: "",
        dateHired: ""
    });

    const loadData = async () => {
        try {
            const [empRes, deptRes] = await Promise.all([
                getAllEmployees(),
                getAllDepartments()
            ]);
            setEmployees(empRes.data);
            setDepartments(deptRes.data);
        } catch (err) {
            setError(getErrorMessage(err, "Failed to load employees"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const getDepartmentName = (id) => {
        const dept = departments.find((d) => d.id === id);
        return dept ? dept.name : "-";
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            const response = await createEmployee(form);
            setMessage(response.message);
            setForm({
                userId: "", employeeNumber: "", firstName: "", lastName: "",
                phone: "", birthDate: "", departmentId: "", position: "", dateHired: ""
            });
            loadData();
        } catch (err) {
            setError(getErrorMessage(err, "Failed to create employee"));
        }
    };

    if (loading) return <Loader />;

    return (
        <div>
            <h1>Employees</h1>

            {error && <p>{error}</p>}
            {message && <p>{message}</p>}

            <h2>Add Employee</h2>
            <form onSubmit={handleSubmit}>
                <input name="userId" placeholder="User ID" value={form.userId} onChange={handleChange} required />
                <input name="employeeNumber" placeholder="Employee Number" value={form.employeeNumber} onChange={handleChange} required />
                <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
                <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
                <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
                <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} />
                <select name="departmentId" value={form.departmentId} onChange={handleChange}>
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                </select>
                <input name="position" placeholder="Position" value={form.position} onChange={handleChange} />
                <input type="date" name="dateHired" value={form.dateHired} onChange={handleChange} />
                <button type="submit">Create Employee</button>
            </form>

            <h2>All Employees</h2>
            {employees.length === 0 ? (
                <EmptyState message="No employees yet" />
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Emp #</th>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Position</th>
                            <th>Date Hired</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((e) => (
                            <tr key={e.id}>
                                <td>{e.employee_number}</td>
                                <td>{e.first_name} {e.last_name}</td>
                                <td>{getDepartmentName(e.department_id)}</td>
                                <td>{e.position}</td>
                                <td>{formatDate(e.date_hired)}</td>
                                <td>{e.employment_status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default EmployeeList;