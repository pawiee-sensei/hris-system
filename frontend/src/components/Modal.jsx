import { X } from "lucide-react";
import "./Modal.css";

const Modal = ({ title, onClose, children, size = "default" }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className={`modal-box modal-${size}`} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="modal-close" onClick={onClose}><X size={20} /></button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;