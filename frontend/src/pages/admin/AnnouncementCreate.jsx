import { useState, useEffect } from "react";
import { Megaphone, Send } from "lucide-react";
import { createAnnouncement, getAllAnnouncements } from "../../api/announcementApi";
import { formatDate } from "../../utils/formatDate";
import getErrorMessage from "../../utils/getErrorMessage";
import useToast from "../../hooks/useToast";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import "./AnnouncementCreate.css";

const AnnouncementCreate = () => {
    const { showToast } = useToast();
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadRecent = async () => {
        try {
            const response = await getAllAnnouncements();
            setRecent(response.data.slice(0, 5));
        } catch (err) {
            showToast(getErrorMessage(err, "Failed to load announcements"), "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRecent();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await createAnnouncement({ title, message });
            showToast(response.message);
            setTitle("");
            setMessage("");
            loadRecent();
        } catch (err) {
            setError(getErrorMessage(err, "Failed to post announcement"));
        }
    };

    if (loading) return <Loader />;

    return (
        <div>
            <div className="page-header">
                <div className="page-icon"><Megaphone size={22} /></div>
                <div>
                    <h1>Post Announcement</h1>
                    <p>Share news and reminders with the whole company</p>
                </div>
            </div>

            <div className="announce-layout">
                <div className="section-card announce-form-card">
                    {error && <p className="form-error-banner">{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Office Holiday Notice"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Message</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Write the announcement details..."
                                rows={6}
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                <Send size={15} /> Post Announcement
                            </button>
                        </div>
                    </form>
                </div>

                <div className="section-card recent-card">
                    <h3>Recently Posted</h3>

                    {recent.length === 0 ? (
                        <EmptyState message="No announcements yet" />
                    ) : (
                        <div className="recent-list">
                            {recent.map((a) => (
                                <div key={a.id} className="recent-item">
                                    <p className="recent-title">{a.title}</p>
                                    <p className="recent-date">{formatDate(a.created_at)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnnouncementCreate;