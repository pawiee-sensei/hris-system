import { useState, useEffect } from "react";
import { Building2, Plus, ChevronRight, UserCog } from "lucide-react";
import { createDepartment, getAllDepartments } from "../../api/departmentApi";
import getErrorMessage from "../../utils/getErrorMessage";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import Modal from "../../components/Modal";
import useToast from "../../hooks/useToast";
import DepartmentDetailModal from "./DepartmentDetailModal";
import "./DepartmentList.css";

const DepartmentList = () => {
    const { showToast } = useToast();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newName, setNewName] = useState("");
    const [formError, setFormError] = useState("");
    const [selectedDeptId, setSelectedDeptId] = useState(null);

    const loadDepartments = async () => {
        try {
            const response = await getAllDepartments();
            setDepartments(response.data);
        } catch (err) {
            showToast(getErrorMessage(err, "Failed to load departments"), "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDepartments();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setFormError("");

        try {
            await createDepartment(newName);
            showToast("Department created successfully");
            setNewName("");
            setShowAddModal(false);
            loadDepartments();
        } catch (err) {
            setFormError(getErrorMessage(err, "Failed to create department"));
        }
    };

    const maxMembers = Math.max(...departments.map((d) => d.member_count), 1);

    if (loading) return <Loader />;

    return (
        <div>
            <div className="page-header">
                <div className="page-icon"><Building2 size={22} /></div>
                <div className="page-header-text">
                    <h1>Departments</h1>
                    <p>Organize your teams and assign managers</p>
                </div>
                <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                    <Plus size={16} /> Add Department
                </button>
            </div>

            {departments.length === 0 ? (
                <EmptyState message="No departments yet" />
            ) : (
                <div className="dept-list">
                    {departments.map((d) => {
                        const loadPercent = Math.round((d.member_count / maxMembers) * 100);

                        return (
                            <div key={d.id} className="dept-row" onClick={() => setSelectedDeptId(d.id)}>
                                <div className="dept-icon"><Building2 size={20} /></div>

                                <div className="dept-info">
                                    <h3>{d.name}</h3>
                                    {d.manager_name ? (
                                        <p className="dept-manager">
                                            <UserCog size={13} /> Managed by {d.manager_name}
                                        </p>
                                    ) : (
                                        <p className="dept-manager dept-no-manager">No manager assigned</p>
                                    )}
                                </div>

                                <div className="dept-load">
                                    <div className="dept-load-track">
                                        <div className="dept-load-fill" style={{ width: `${loadPercent}%` }} />
                                    </div>
                                </div>

                                <span className="dept-count-badge">{d.member_count} members</span>

                                <ChevronRight size={18} className="dept-chevron" />
                            </div>
                        );
                    })}
                </div>
            )}

            {showAddModal && (
                <Modal title="Add Department" onClose={() => setShowAddModal(false)}>
                    <form onSubmit={handleCreate} className="dept-add-form">
                        {formError && <p className="form-error-banner">{formError}</p>}

                        <div className="form-group">
                            <label>Department Name</label>
                            <input
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="e.g. Marketing"
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary">Create Department</button>
                        </div>
                    </form>
                </Modal>
            )}

            {selectedDeptId && (
                <DepartmentDetailModal
                    departmentId={selectedDeptId}
                    onClose={() => setSelectedDeptId(null)}
                    onUpdated={loadDepartments}
                />
            )}
        </div>
    );
};

export default DepartmentList;