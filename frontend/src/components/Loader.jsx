import "./Loader.css";

const Loader = ({ variant = "page" }) => {
    if (variant === "inline") {
        return <div className="skeleton skeleton-inline" />;
    }

    return (
        <div className="skeleton-page">
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-subtitle" />

            <div className="skeleton-row">
                <div className="skeleton skeleton-card" />
                <div className="skeleton skeleton-card" />
                <div className="skeleton skeleton-card" />
            </div>

            <div className="skeleton skeleton-block" />
        </div>
    );
};

export default Loader;