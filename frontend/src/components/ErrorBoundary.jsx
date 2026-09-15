import { Component } from "react";
import "./ErrorBoundary.css";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error("App crashed:", error, info);
    }

    handleReload = () => {
        window.location.href = "/dashboard";
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <div className="error-box">
                        <h2>Something went wrong</h2>
                        <p>An unexpected error occurred. You can go back to the dashboard and try again.</p>
                        <button onClick={this.handleReload}>Back to Dashboard</button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;