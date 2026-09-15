import { createContext, useState, useCallback } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import "./ToastContext.css";

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = "success") => {
        setToast({ message, type });

        setTimeout(() => {
            setToast(null);
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ toast, showToast }}>
            {children}
            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.type === "error" ? <XCircle size={18} /> : <CheckCircle size={18} />}
                    {toast.message}
                </div>
            )}
        </ToastContext.Provider>
    );
};