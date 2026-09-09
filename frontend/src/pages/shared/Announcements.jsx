import { useState, useEffect } from "react";
import { getAllAnnouncements } from "../../api/announcementApi";
import { formatDate } from "../../utils/formatDate";
import getErrorMessage from "../../utils/getErrorMessage";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const response = await getAllAnnouncements();
                setAnnouncements(response.data);
            } catch (err) {
                setError(getErrorMessage(err, "Failed to load announcements"));
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <Loader />;

    return (
        <div>
            <h1>Announcements</h1>

            {error && <p>{error}</p>}

            {announcements.length === 0 ? (
                <EmptyState message="No announcements yet" />
            ) : (
                announcements.map((a) => (
                    <div key={a.id}>
                        <h3>{a.title}</h3>
                        <p>{a.message}</p>
                        <small>{formatDate(a.created_at)}</small>
                        <hr />
                    </div>
                ))
            )}
        </div>
    );
};

export default Announcements;