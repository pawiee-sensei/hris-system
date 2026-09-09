import { useState, useEffect } from "react";
import { getMyLeaveBalances } from "../../api/leaveBalanceApi";
import getErrorMessage from "../../utils/getErrorMessage";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";

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
            <h1>My Leave Balance</h1>

            {error && <p>{error}</p>}

            {balances.length === 0 ? (
                <EmptyState message="No leave balance set up yet" />
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Leave Type</th>
                            <th>Total</th>
                            <th>Used</th>
                            <th>Remaining</th>
                        </tr>
                    </thead>
                    <tbody>
                        {balances.map((b) => (
                            <tr key={b.id}>
                                <td>{b.leave_type}</td>
                                <td>{b.total_credits}</td>
                                <td>{b.used_credits}</td>
                                <td>{b.total_credits - b.used_credits}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MyLeaveBalance;