import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./AppLayout.css";

const AppLayout = ({ children }) => {
    return (
        <div className="app-layout">
            <Sidebar />
            <div className="app-body">
                <Navbar />
                <main className="app-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AppLayout;