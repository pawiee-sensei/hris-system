import { createContext, useState, useCallback } from "react";
import { AlertTriangle } from "lucide-react";
import "./ConfirmContext.css";

export const ConfirmContext = createContext();

export const ConfirmProvider = ({ children }) => {
    const [confirmState, setConfirmState] = useState(null);

    const confirm = useCallback((message) => {
        return new Promise((resolve) => {
            setConfirmState({
                message,
                onConfirm: () => {
                    setConfirmState(null);
                    resolve(true);
                },
                onCancel: () => {
                    setConfirmState(null);
                    resolve(false);
                }
            });
        });
    }, []);

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            {confirmState && (
                <div className="confirm-overlay" onClick={confirmState.onCancel}>
                    <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
                        <div className="confirm-icon"><AlertTriangle size={22} /></div>
                        <p>{confirmState.message}</p>
                        <div className="confirm-actions">
                            <button className="confirm-btn-cancel" onClick={confirmState.onCancel}>Cancel</button>
                            <button className="confirm-btn-yes" onClick={confirmState.onConfirm}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmContext.Provider>
    );
};