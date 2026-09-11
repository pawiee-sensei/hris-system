import { useState, useEffect } from "react";
import { UserPlus, Users, Search, MoreVertical, Pencil, UserX } from "lucide-react";
import {
    createEmployee, getAllEmployees, updateEmployee, updateEmploymentStatus
} from "../../api/employeeApi";
import { getAllDepartments } from "../../api/departmentApi";
import { getUnassignedUsers } from "../../api/authApi";
import { formatDate } from "../../utils/formatDate";
import getErrorMessage from "../../utils/getErrorMessage";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import Modal from "../../components/Modal";
import useToast from "../../hooks/useToast";
import useConfirm from "../../hooks/useConfirm";
import "./EmployeeList.css";

const emptyForm = {
    userId: "", employeeNumber: "", firstName: "", lastName: "",
    phone: "", birthDate: "", departmentId: "", position: "", dateHired: ""
};

const EmployeeList = () => {
    const { showToast } = useToast();
    const { confirm } = useConfirm();

    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [unassignedUsers, setUnassignedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [openMenuId, setOpenMenuId] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState("");

    const getSuggestedEmployeeNumber = (empList) => {
        const next = empList.length + 1;
        return `EMP-${String(next).padStart(4, "0")}`;
    };

    const loadData = async () => {
        try {
            const [empRes, deptRes, usersRes] = await Promise.all([
                getAllEmployees(),
                getAllDepartments(),
                getUnassignedUsers()
            ]);
            setEmployees(empRes.data);
            setDepartments(deptRes.data);
            setUnassignedUsers(usersRes.data);
        } catch (err) {
            showToast(getErrorMessage(err, "Failed to load employees"), "error");
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

    const openAddModal = () => {
        setEditingId(null);
        setForm({ ...emptyForm, employeeNumber: getSuggestedEmployeeNumber(employees) });
        setFieldErrors({});
        setFormError("");
        setShowModal(true);
    };

    const openEditModal = (emp) => {
        setEditingId(emp.id);
        setForm({
            userId: emp.user_id,
            employeeNumber: emp.employee_number,
            firstName: emp.first_name,
            lastName: emp.last_name,
            phone: emp.phone || "",
            birthDate: emp.birth_date || "",
            departmentId: emp.department_id || "",
            position: emp.position || "",
            dateHired: emp.date_hired || ""
        });
        setFieldErrors({});
        setFormError("");
        setShowModal(true);
        setOpenMenuId(null);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const getFieldError = (field) => fieldErrors[field];

    const buildPayload = (data) => ({
        ...data,
        phone: data.phone || null,
        birthDate: data.birthDate || null,
        departmentId: data.departmentId || null,
        position: data.position || null,
        dateHired: data.dateHired || null
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFieldErrors({});
        setFormError("");

        try {
            if (editingId) {
                const { userId, employeeNumber, ...editableData } = form;
                await updateEmployee(editingId, buildPayload(editableData));
                showToast("Employee updated successfully");
            } else {
                await createEmployee(buildPayload(form));
                showToast("Employee created successfully");
            }
            setShowModal(false);
            loadData();
        } catch (err) {
            const validationErrors = err.response?.data?.errors;
            const backendMessage = err.response?.data?.message || "";

            if (validationErrors?.length) {
                const map = {};
                validationErrors.forEach((v) => { map[v.field] = v.message; });
                setFieldErrors(map);
            } else if (backendMessage.toLowerCase().includes("employee number")) {
                setFieldErrors({ employeeNumber: backendMessage });
            } else if (backendMessage.toLowerCase().includes("account")) {
                setFieldErrors({ userId: backendMessage });
            } else {
                setFormError(getErrorMessage(err, "Failed to save employee"));
            }
        }
    };

    const handleTerminate = async (emp) => {
        setOpenMenuId(null);
        const ok = await confirm(`Mark ${emp.first_name} ${emp.last_name} as Terminated?`);
        if (!ok) return;

        try {
            await updateEmploymentStatus(emp.id, "TERMINATED");
            showToast("Employee marked as terminated");
            loadData();
        } catch (err) {
            showToast(getErrorMessage(err, "Failed to update status"), "error");
        }
    };

    const getStatusBadge = (status) => {
        const map = {
            ACTIVE: "badge-green",
            RESIGNED: "badge-gray",
            TERMINATED: "badge-red"
        };
        return <span className={`status-badge ${map[status]}`}>{status.charAt(0) + status.slice(1).toLowerCase()}</span>;
    };

    const filteredEmployees = employees.filter((e) =>
        `${e.first_name} ${e.last_name}`.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <Loader />;

    return (
        <div>
            <div className="page-header">
                <div className="page-icon"><Users size={22} /></div>
                <div>
                    <h1>Employees</h1>
                    <p>Manage employee records and onboard new staff</p>
                </div>
            </div>

            <div className="section-card">
                <div className="section-header">
                    <div className="section-title">
                        <Users size={18} />
                        <h3>All Employees</h3>
                    </div>

                    <div className="section-actions">
                        <div className="search-box">
                            <Search size={16} />
                            <input
                                placeholder="Search by name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button className="btn-primary" onClick={openAddModal}>
                            <UserPlus size={16} /> Add Employee
                        </button>
                    </div>
                </div>

                {filteredEmployees.length === 0 ? (
                    <EmptyState message="No employees found" />
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Emp #</th>
                                <th>Name</th>
                                <th>Department</th>
                                <th>Position</th>
                                <th>Date Hired</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map((e) => (
                                <tr key={e.id}>
                                    <td>{e.employee_number}</td>
                                    <td>{e.first_name} {e.last_name}</td>
                                    <td>{getDepartmentName(e.department_id)}</td>
                                    <td>{e.position}</td>
                                    <td>{formatDate(e.date_hired)}</td>
                                    <td>{getStatusBadge(e.employment_status)}</td>
                                    <td className="actions-cell">
                                        <button
                                            className="menu-trigger"
                                            onClick={() => setOpenMenuId(openMenuId === e.id ? null : e.id)}
                                        >
                                            <MoreVertical size={18} />
                                        </button>

                                        {openMenuId === e.id && (
                                            <div className="dropdown-menu">
                                                <button onClick={() => openEditModal(e)}>
                                                    <Pencil size={14} /> Edit
                                                </button>
                                                <button className="danger" onClick={() => handleTerminate(e)}>
                                                    <UserX size={14} /> Terminate
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <p className="table-count">Showing {filteredEmployees.length} of {employees.length} employees</p>
            </div>

            {showModal && (
                <Modal title={editingId ? "Edit Employee" : "Add Employee"} onClose={() => setShowModal(false)}>
                    <form onSubmit={handleSubmit} className="employee-form">
                        {formError && <p className="form-error-banner">{formError}</p>}

                        {!editingId && (
                            <div className="form-group">
                                <label>Select Account</label>
                                <select
                                    name="userId"
                                    value={form.userId}
                                    onChange={handleChange}
                                    required
                                    className={getFieldError("userId") ? "input-error" : ""}
                                >
                                    <option value="">Select an account (email)</option>
                                    {unassignedUsers.map((u) => (
                                        <option key={u.id} value={u.id}>{u.email} ({u.role})</option>
                                    ))}
                                </select>
                                {getFieldError("userId") && <p className="field-error">{getFieldError("userId")}</p>}
                            </div>
                        )}

                        <div className="form-row">
                            <div className="form-group">
                                <label>Employee Number</label>
                                <input
                                    name="employeeNumber"
                                    value={form.employeeNumber}
                                    onChange={handleChange}
                                    disabled={!!editingId}
                                    required
                                    className={getFieldError("employeeNumber") ? "input-error" : ""}
                                />
                                {getFieldError("employeeNumber") && <p className="field-error">{getFieldError("employeeNumber")}</p>}
                            </div>
                            <div className="form-group">
                                <label>Position <span className="optional">(Optional)</span></label>
                                <input name="position" value={form.position} onChange={handleChange} />
                                {getFieldError("position") && <p className="field-error">{getFieldError("position")}</p>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>First Name</label>
                                <input name="firstName" value={form.firstName} onChange={handleChange} required />
                                {getFieldError("firstName") && <p className="field-error">{getFieldError("firstName")}</p>}
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input name="lastName" value={form.lastName} onChange={handleChange} required />
                                {getFieldError("lastName") && <p className="field-error">{getFieldError("lastName")}</p>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Phone <span className="optional">(Optional)</span></label>
                                <input name="phone" value={form.phone} onChange={handleChange} />
                                {getFieldError("phone") && <p className="field-error">{getFieldError("phone")}</p>}
                            </div>
                            <div className="form-group">
                                <label>Birth Date <span className="optional">(Optional)</span></label>
                                <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} />
                                {getFieldError("birthDate") && <p className="field-error">{getFieldError("birthDate")}</p>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Department <span className="optional">(Optional)</span></label>
                                <select name="departmentId" value={form.departmentId} onChange={handleChange}>
                                    <option value="">Select Department</option>
                                    {departments.map((d) => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                                {getFieldError("departmentId") && <p className="field-error">{getFieldError("departmentId")}</p>}
                            </div>
                            <div className="form-group">
                                <label>Date Hired <span className="optional">(Optional)</span></label>
                                <input type="date" name="dateHired" value={form.dateHired} onChange={handleChange} />
                                {getFieldError("dateHired") && <p className="field-error">{getFieldError("dateHired")}</p>}
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                {editingId ? "Save Changes" : "Create Employee"}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default EmployeeList;