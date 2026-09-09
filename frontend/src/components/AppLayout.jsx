import Sidebar from "./Sidebar";

const AppLayout = ({ children }) => {
    return (
        <div style={{ display: "flex" }}>
            <Sidebar />
            <main style={{ flex: 1 }}>
                {children}
            </main>
        </div>
    );
};

export default AppLayout;