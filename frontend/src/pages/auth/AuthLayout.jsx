import "./AuthLayout.css";

const AuthLayout = ({ children }) => {
    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-brand">HRIS</h2>
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;