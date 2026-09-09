import { useState } from "react";
import { createAnnouncement } from "../../api/announcementApi";
import getErrorMessage from "../../utils/getErrorMessage";

const AnnouncementCreate = () => {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await createAnnouncement({ title, message });
            setSuccess(response.message);
            setTitle("");
            setMessage("");
        } catch (err) {
            setError(getErrorMessage(err, "Failed to post announcement"));
        }
    };

    return (
        <div>
            <h1>Post Announcement</h1>

            {error && <p>{error}</p>}
            {success && <p>{success}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Message</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Post</button>
            </form>
        </div>
    );
};

export default AnnouncementCreate;