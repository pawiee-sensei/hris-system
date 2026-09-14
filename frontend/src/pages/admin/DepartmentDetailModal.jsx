import { useState, useEffect } from "react";
import { UserCog, Search, X, UserMinus, ArrowRightLeft } from "lucide-react";
import {
    getDepartmentDetails, getAvailableEmployees, addMembersToDepartment,
    removeMemberFromDepartment, setDepartmentManager
} from "../../api/departmentApi";
import getErrorMessage from "../../utils/getErrorMessage";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import useToast from "../../hooks/useToast";
import useConfirm from "../../hooks/useConfirm";
import "./DepartmentDetailModal.css";

const DepartmentDetailModal = ({ departmentId, onClose, onUpdated }) => {
    const { showToast } = useToast();
    const { confirm } = useConfirm();

    const [department, setDepartment] = useState(null);
    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [showManagerPicker, setShowManagerPicker] = useState(false);

    const loadAll = async () => {
        try {
            const [deptRes, empRes] = await Promise.all([
                getDepartmentDetails(departmentId),
                getAvailableEmployees(departmentId)
            ]);
            setDepartment(deptRes.data);
            setAvailableEmployees(empRes.data);
        } catch (err) {
            showToast(getErrorMessage(err, "Failed to load department"), "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAll();
    }, [departmentId]);

    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleAddSelected = async () => {
        const movingFromOther = availableEmployees.filter(
            (e) => selectedIds.includes(e.id) && e.department_id
        );

        if (movingFromOther.length > 0) {
            const names = movingFromOther.map((e) => `${e.first_name} ${e.last_name}`).join(", ");
            const ok = await confirm(
                `${names} ${movingFromOther.length > 1 ? "are" : "is"} currently in another department. Move to ${department.name}?`
            );
            if (!ok) return;
        }

        try {
            await addMembersToDepartment(departmentId, selectedIds);
            showToast("Members added successfully");
            setSelectedIds([]);
            loadAll();
            onUpdated();
        } catch (err) {
            showToast(getErrorMessage(err, "Failed to add members"), "error");
        }
    };

    const handleRemove = async (employee) => {
        const ok = await confirm(`Remove ${employee.first_name} ${employee.last_name} from ${department.name}?`);
        if (!ok) return;

        try {
            await removeMemberFromDepartment(departmentId, employee.id);
            showToast("Member removed");
            loadAll();
            onUpdated();
        } catch (err) {
            showToast(getErrorMessage(err, "Failed to remove member"), "error");
        }
    };

    const handleSetManager = async (managerId) => {
        try {
            await setDepartmentManager(departmentId, managerId);
            showToast("Manager updated");
            setShowManagerPicker(false);
            loadAll();
            onUpdated();
        } catch (err) {
            showToast(getErrorMessage(err, "Failed to set manager"), "error");
        }
    };

    const filteredAvailable = availableEmployees.filter((e) =>
        `${e.first_name} ${e.last_name}`.toLowerCase().includes(search.toLowerCase())
    );

    if (loading || !department) {
        return (
            <Modal title="Loading..." onClose={onClose}>
                <Loader />
            </Modal>
        );
    }

    return (
        <Modal title={department.name} onClose={onClose} size="large">
            <div className="dept-modal-manager">
                <UserCog size={16} />
                {department.manager_name ? (
                    <span>Managed by <strong>{department.manager_name}</strong></span>
                ) : (
                    <span className="no-manager-text">No manager assigned</span>
                )}
                <button className="link-btn" onClick={() => setShowManagerPicker(!showManagerPicker)}>
                    Change Manager
                </button>
            </div>

            {showManagerPicker && (
                <div className="manager-picker">
                    <select onChange={(e) => handleSetManager(e.target.value || null)} defaultValue="">
                        <option value="">No manager</option>
                        {department.members.map((m) => (
                            <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>
                        ))}
                    </select>
                    <p className="manager-hint">Only current members can be set as manager</p>
                </div>
            )}

            <div className="dept-modal-columns">
                <div className="dept-modal-col">
                    <h4>Current Members ({department.members.length})</h4>
                    <div className="member-list">
                        {department.members.length === 0 ? (
                            <p className="empty-hint">No members yet</p>
                        ) : (
                            department.members.map((m) => (
                                <div key={m.id} className="member-row">
                                    <div className="member-avatar">
                                        {m.first_name.charAt(0)}{m.last_name.charAt(0)}
                                    </div>
                                    <div className="member-info">
                                        <p className="member-name">{m.first_name} {m.last_name}</p>
                                        <p className="member-position">{m.position || "-"}</p>
                                    </div>
                                    <button className="icon-btn" onClick={() => handleRemove(m)}>
                                        <UserMinus size={16} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="dept-modal-col">
                    <h4>Add Members</h4>
                    <div className="picker-search">
                        <Search size={14} />
                        <input
                            placeholder="Search employees..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="picker-list">
                        {filteredAvailable.length === 0 ? (
                            <p className="empty-hint">No available employees</p>
                        ) : (
                            filteredAvailable.map((e) => (
                                <label key={e.id} className="picker-row">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(e.id)}
                                        onChange={() => toggleSelect(e.id)}
                                    />
                                    <div className="member-avatar small">
                                        {e.first_name.charAt(0)}{e.last_name.charAt(0)}
                                    </div>
                                    <div className="member-info">
                                        <p className="member-name">{e.first_name} {e.last_name}</p>
                                        <p className="member-position">
                                            {e.department_name ? (
                                                <span className="picker-current-dept">
                                                    <ArrowRightLeft size={11} /> Currently: {e.department_name}
                                                </span>
                                            ) : "Unassigned"}
                                        </p>
                                    </div>
                                </label>
                            ))
                        )}
                    </div>

                    <button
                        className="btn-primary btn-block"
                        disabled={selectedIds.length === 0}
                        onClick={handleAddSelected}
                    >
                        Add Selected ({selectedIds.length})
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default DepartmentDetailModal;