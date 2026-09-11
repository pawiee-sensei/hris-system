import { useState, useEffect } from "react";
import { Wallet } from "lucide-react";
import { getMyLeaveBalances } from "../../api/leaveBalanceApi";
import getErrorMessage from "../../utils/getErrorMessage";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import "./MyLeaveBalance.css";

const typeIcons = {
    VACATION: "🏖️",
    SICK: "🩺",
    EMERGENCY: "🚨"
};

const MyLeaveBalance = () => {
    const [balances, setBalances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const response = await getMyLeaveBalances();
                setBalances(response.data);
            } catch (err) {
                setError(getErrorMessage(err, "Failed to load balances"));
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <Loader />;

    return (
        <div>
            <div className="balance-header">
                <h1>My Leave Balance</h1>
                <p>Track your remaining leave credits by type</p>
            </div>

            {error && <p className="balance-error">{error}</p>}

            {balances.length === 0 ? (
                <EmptyState message="No leave balance set up yet" />
            ) : (
                <div className="balance-grid">
                    {balances.map((b) => {
                        const remaining = b.total_credits - b.used_credits;
                        const percentUsed = Math.round((b.used_credits / b.total_credits) * 100);

                        return (
                            <div key={b.id} className="balance-card">
                                <div className="balance-card-top">
                                    <div className="balance-icon">
                                        <Wallet size={18} />
                                    </div>
                                    <span className="balance-type">
                                        {b.leave_type.charAt(0) + b.leave_type.slice(1).toLowerCase()}
                                    </span>
                                </div>

                                <p className="balance-remaining">{remaining} <span>days left</span></p>

                                <div className="balance-bar-track">
                                    <div className="balance-bar-fill" style={{ width: `${percentUsed}%` }} />
                                </div>

                                <div className="balance-footer">
                                    <span>{b.used_credits} used</span>
                                    <span>{b.total_credits} total</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyLeaveBalance;