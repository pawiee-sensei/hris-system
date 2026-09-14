import { useState, useEffect } from "react";
import { ClipboardCheck, Check, X } from "lucide-react";
import { getAllLeave, reviewLeave } from "../../api/leaveApi";
import { formatDate } from "../../utils/formatDate";
import getErrorMessage from "../../utils/getErrorMessage";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import useToast from "../../hooks/useToast";
import useConfirm from "../../hooks/useConfirm";
import "./LeaveApprovals.css";

const LeaveApprovals = () => {
    const { showToast } = useToast();
    const { confirm } = useConfirm();

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");

    const loadLeave = async () => {
        try {
            const response = await getAllLeave();
            setRecords(response.data);
        } catch (err) {
            showToast(getErrorMessage(err, "Failed to load leave requests"), "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLeave();
    }, []);

    const handleReview = async (record, status) => {
        const ok = await confirm(`${status === "APPROVED" ? "Approve" : "Reject"} this leave request?`);
        if (!ok) return;

        try {
            const response = await reviewLeave(record.id, status);
            showToast(response.message);
            loadLeave();
        } catch (err) {
            showToast(getErrorMessage(err, "Failed to review leave"), "error");
        }
    };

    const getLeaveTypeTag = (type) => {
        const map = { VACATION: "tag-blue", SICK: "tag-purple", EMERGENCY: "tag-amber" };
        return <span className={`leave-tag ${map[type]}`}>{type.charAt(0) + type.slice(1).toLowerCase()}</span>;
    };

    const getStatusBadge = (status) => {
        const map = { PENDING: "badge-amber", APPROVED: "badge-green", REJECTED: "badge-red" };
        return <span className={`status-badge ${map[status]}`}>{status.charAt(0) + status.slice(1).toLowerCase()}</span>;
    };

    const getDays = (start, end) => {
        const diff = (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24);
        return Math.round(diff) + 1;
    };

    const pendingCount = records.filter((r) => r.status === "PENDING").length;

    const filteredRecords = filter === "ALL" ? records : records.filter((r) => r.status === filter);

    if (loading) return <Loader />;

    return (
        <div>
            <div className="page-header">
                <div className="page-icon"><ClipboardCheck size={22} /></div>
                <div className="page-header-text">
                    <h1>Leave Approvals</h1>
                    <p>Review and act on employee leave requests</p>
                </div>
                {pendingCount > 0 && <span className="pending-pill">{pendingCount} pending</span>}
            </div>

            <div className="section-card">
                <div className="filter-tabs">
                    {["ALL", "PENDING", "APPROVED", "REJECTED"].map((f) => (
                        <button
                            key={f}
                            className={`filter-tab ${filter === f ? "active" : ""}`}
                            onClick={() => setFilter(f)}
                        >
                            {f.charAt(0) + f.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>

                {filteredRecords.length === 0 ? (
                    <EmptyState message="No leave requests found" />
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Employee ID</th>
                                <th>Type</th>
                                <th>Dates</th>
                                <th>Days</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.map((r) => (
                                <tr key={r.id} className={r.status === "PENDING" ? "row-pending" : "row-muted"}>
                                    <td>#{r.employee_id}</td>
                                    <td>{getLeaveTypeTag(r.leave_type)}</td>
                                    <td>{formatDate(r.start_date)} - {formatDate(r.end_date)}</td>
                                    <td>{getDays(r.start_date, r.end_date)}</td>
                                    <td>{getStatusBadge(r.status)}</td>
                                    <td className="actions-cell">
                                        {r.status === "PENDING" && (
                                            <div className="action-buttons-inline">
                                                <button className="btn-approve" onClick={() => handleReview(r, "APPROVED")}>
                                                    <Check size={14} /> Approve
                                                </button>
                                                <button className="btn-reject" onClick={() => handleReview(r, "REJECTED")}>
                                                    <X size={14} /> Reject
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default LeaveApprovals;