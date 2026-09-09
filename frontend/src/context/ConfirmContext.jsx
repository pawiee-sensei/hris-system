import { createContext, useState, useCallback } from "react";

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
                <div className="confirm-dialog">
                    <p>{confirmState.message}</p>
                    <button onClick={confirmState.onConfirm}>Yes</button>
                    <button onClick={confirmState.onCancel}>Cancel</button>
                </div>
            )}
        </ConfirmContext.Provider>
    );
};