import { useState, useEffect } from "react";
import { Megaphone } from "lucide-react";
import { getAllAnnouncements } from "../../api/announcementApi";
import { formatDate } from "../../utils/formatDate";
import getErrorMessage from "../../utils/getErrorMessage";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import "./Announcements.css";

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
            <div className="announce-header">
                <h1>Announcements</h1>
                <p>Stay updated with the latest news and reminders from HR</p>
            </div>

            {error && <p className="announce-error">{error}</p>}

            {announcements.length === 0 ? (
                <EmptyState message="No announcements yet" />
            ) : (
                <div className="announce-list">
                    {announcements.map((a, index) => {
                        const colors = ["icon-blue", "icon-purple", "icon-amber"];
                        const colorClass = colors[index % colors.length];

                        return (
                            <div key={a.id} className={`announce-card ${index === 0 ? "announce-latest" : ""}`}>
                                <div className={`announce-icon ${colorClass}`}><Megaphone size={18} /></div>
                                <div className="announce-content">
                                    <div className="announce-top">
                                        <div className="announce-title-row">
                                            <h3>{a.title}</h3>
                                            {index === 0 && <span className="announce-new-badge">New</span>}
                                        </div>
                                        <span className="announce-date">{formatDate(a.created_at)}</span>
                                    </div>
                                    <p>{a.message}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Announcements;