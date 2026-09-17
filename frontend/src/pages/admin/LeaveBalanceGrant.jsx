import { useState, useEffect } from "react";
import { Wallet, RefreshCw, History, AlertTriangle } from "lucide-react";
import { grantLeaveBalance, getEmployeeBalances, previewYearlyGeneration, generateYearlyBalances, getEmployeeGrantLogs, getAllGrantLogs } from "../../api/leaveBalanceApi";
import { formatDate } from "../../utils/formatDate";
import { getAllEmployees } from "../../api/employeeApi";
import getErrorMessage from "../../utils/getErrorMessage";
import useToast from "../../hooks/useToast";
import useConfirm from "../../hooks/useConfirm";
import Loader from "../../components/Loader";
import "./LeaveBalanceGrant.css";

const LeaveBalanceGrant = () => {
    const { showToast } = useToast();
    const { confirm } = useConfirm();

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    const [employeeId, setEmployeeId] = useState("");
    const [currentBalances, setCurrentBalances] = useState([]);
    const [loadingBalances, setLoadingBalances] = useState(false);

    const [leaveType, setLeaveType] = useState("VACATION");
    const [totalCredits, setTotalCredits] = useState("");
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    const [grantLogs, setGrantLogs] = useState([]);
    const [loadingLogs, setLoadingLogs] = useState(false);

    const [flaggedGrants, setFlaggedGrants] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const response = await getAllEmployees();
                setEmployees(response.data.filter((e) => e.employment_status === "ACTIVE"));
            } catch (err) {
                showToast(getErrorMessage(err, "Failed to load employees"), "error");
            } finally {
                setLoading(false);
            }
        };
        load();

        const loadFlagged = async () => {
            try {
                const response = await getAllGrantLogs();
                setFlaggedGrants(response.data.filter((l) => l.flagged));
            } catch (err) {
                setFlaggedGrants([]);
            }
        };
        loadFlagged();
    }, []);

    useEffect(() => {
        if (!employeeId) {
            setCurrentBalances([]);
            setGrantLogs([]);
            return;
        }

        const loadBalances = async () => {
            setLoadingBalances(true);
            try {
                const response = await getEmployeeBalances(employeeId);
                setCurrentBalances(response.data);
            } catch (err) {
                setCurrentBalances([]);
            } finally {
                setLoadingBalances(false);
            }
        };

        const loadLogs = async () => {
            setLoadingLogs(true);
            try {
                const response = await getEmployeeGrantLogs(employeeId);
                setGrantLogs(response.data);
            } catch (err) {
                setGrantLogs([]);
            } finally {
                setLoadingLogs(false);
            }
        };

        loadBalances();
        loadLogs();
    }, [employeeId]);

    const existingForType = currentBalances.find((b) => b.leave_type === leaveType);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (existingForType && totalCredits) {
            const newTotal = existingForType.total_credits + Number(totalCredits);
            const ok = await confirm(
                `This will add ${totalCredits} days to their current ${existingForType.total_credits} ${leaveType.toLowerCase()} days (new total: ${newTotal}). Continue?`
            );
            if (!ok) return;
        }

        try {
            const response = await grantLeaveBalance({ employeeId, leaveType, totalCredits, reason });
            showToast(response.message);
            setTotalCredits("");
            setReason("");
            const balancesRes = await getEmployeeBalances(employeeId);
            setCurrentBalances(balancesRes.data);
            const logsRes = await getEmployeeGrantLogs(employeeId);
            setGrantLogs(logsRes.data);
        } catch (err) {
            setError(getErrorMessage(err, "Failed to grant leave balance"));
        }
    };

    if (loading) return <Loader />;

    return (
        <div>
            <div className="page-header">
                <div className="page-icon"><Wallet size={22} /></div>
                <div>
                    <h1>Grant Leave Balance</h1>
                    <p>Assign leave credits to an active employee</p>
                </div>
            </div>

            {flaggedGrants.length > 0 && (
                <div className="section-card flagged-alert-card">
                    <h3><AlertTriangle size={16} /> {flaggedGrants.length} Grant(s) Flagged for Review</h3>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Employee</th>
                                <th>Type</th>
                                <th>Days</th>
                                <th>Granted By</th>
                                <th>Reason</th>
                                <th>Why Flagged</th>
                            </tr>
                        </thead>
                        <tbody>
                            {flaggedGrants.map((log) => (
                                <tr key={log.id}>
                                    <td>{formatDate(log.created_at)}</td>
                                    <td>{log.employee_name}</td>
                                    <td>{log.leave_type.charAt(0) + log.leave_type.slice(1).toLowerCase()}</td>
                                    <td>+{log.credits_granted}</td>
                                    <td>{log.granted_by_email}</td>
                                    <td>{log.reason}</td>
                                    <td className="flag-reasons-cell">{log.flagReasons.join("; ")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="grant-layout">
                <div className="section-card grant-card">
                    {error && <p className="form-error-banner">{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Employee</label>
                            <select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} required>
                                <option value="">Select an employee</option>
                                {employees.map((e) => (
                                    <option key={e.id} value={e.id}>
                                        {e.first_name} {e.last_name} ({e.employee_number})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Leave Type</label>
                                <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                                    <option value="SICK">Sick</option>
                                    <option value="VACATION">Vacation</option>
                                    <option value="EMERGENCY">Emergency</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Days to Grant</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="365"
                                    value={totalCredits}
                                    onChange={(e) => setTotalCredits(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Reason</label>
                            <input
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="e.g. Family emergency, unused leave adjustment"
                                required
                            />
                        </div>

                        {existingForType && (
                            <p className="topup-hint">
                                This employee already has {existingForType.total_credits} {leaveType.toLowerCase()} days this year — this will add to it.
                            </p>
                        )}

                        <div className="form-actions">
                            <button type="submit" className="btn-primary">Grant Balance</button>
                        </div>
                    </form>
                </div>

                <div className="section-card preview-card">
                    <h3>Current Year Balances</h3>

                    {!employeeId ? (
                        <p className="empty-hint">Select an employee to view their balances</p>
                    ) : loadingBalances ? (
                        <Loader />
                    ) : currentBalances.length === 0 ? (
                        <p className="empty-hint">No balances yet for this employee</p>
                    ) : (
                        <div className="preview-list">
                            {currentBalances.map((b) => (
                                <div key={b.id} className="preview-row">
                                    <span className="preview-type">{b.leave_type.charAt(0) + b.leave_type.slice(1).toLowerCase()}</span>
                                    <span className="preview-value">{b.total_credits - b.used_credits} / {b.total_credits} left</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {employeeId && (
                <div className="section-card logs-card">
                    <h3><History size={16} /> Grant History for This Employee</h3>

                    {loadingLogs ? (
                        <Loader variant="inline" />
                    ) : grantLogs.length === 0 ? (
                        <p className="empty-hint">No manual grants recorded yet</p>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Days</th>
                                    <th>Granted By</th>
                                    <th>Reason</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {grantLogs.map((log) => (
                                    <tr key={log.id} className={log.flagged ? "row-flagged" : ""}>
                                        <td>{formatDate(log.created_at)}</td>
                                        <td>{log.leave_type.charAt(0) + log.leave_type.slice(1).toLowerCase()}</td>
                                        <td>+{log.credits_granted}</td>
                                        <td>{log.granted_by_email}</td>
                                        <td>{log.reason}</td>
                                        <td>
                                            {log.flagged && (
                                                <span className="flag-badge" title={log.flagReasons.join("; ")}>
                                                    <AlertTriangle size={13} /> Review
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            <YearlyGenerationCard />
        </div>
    );
};

const YearlyGenerationCard = () => {
    const { showToast } = useToast();
    const { confirm } = useConfirm();
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const currentYear = new Date().getFullYear();

    const loadPreview = async () => {
        setLoading(true);
        try {
            const response = await previewYearlyGeneration(currentYear);
            setPreview(response.data);
        } catch (err) {
            showToast(getErrorMessage(err, "Failed to load preview"), "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPreview();
    }, []);

    const totalAffected = preview
        ? Object.values(preview.affectedCounts).reduce((sum, n) => sum + n, 0)
        : 0;

    const handleGenerate = async () => {
        if (totalAffected === 0) {
            showToast("Everyone already has balances for this year", "error");
            return;
        }

        const ok = await confirm(
            `This will generate ${currentYear} default balances for employees currently missing them (${totalAffected} balance entries across all types). This cannot be easily undone. Continue?`
        );
        if (!ok) return;

        try {
            const response = await generateYearlyBalances(currentYear);
            showToast(response.message);
            loadPreview();
        } catch (err) {
            showToast(getErrorMessage(err, "Failed to generate balances"), "error");
        }
    };

    return (
        <div className="section-card yearly-card">
            <div className="yearly-header">
                <div>
                    <h3><RefreshCw size={16} /> Yearly Balance Generation</h3>
                    <p>Generate default leave balances for {currentYear} for any active employee who doesn't have them yet.</p>
                </div>
                <button className="btn-primary" onClick={handleGenerate} disabled={loading}>
                    Generate {currentYear} Balances
                </button>
            </div>

            {preview && (
                <div className="yearly-preview">
                    {Object.entries(preview.affectedCounts).map(([type, count]) => (
                        <span key={type} className="yearly-tag">
                            {type.charAt(0) + type.slice(1).toLowerCase()}: {count} missing
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LeaveBalanceGrant;