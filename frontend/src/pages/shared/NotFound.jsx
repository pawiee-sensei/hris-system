import { Link } from "react-router-dom";
import { CompassIcon } from "lucide-react";
import "./NotFound.css";

const NotFound = () => {
    return (
        <div className="notfound-page">
            <div className="notfound-icon"><CompassIcon size={40} /></div>
            <h1>404</h1>
            <p>The page you're looking for doesn't exist.</p>
            <Link to="/dashboard" className="notfound-link">Back to Dashboard</Link>
        </div>
    );
};

export default NotFound;