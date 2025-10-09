import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

type ModalProps = {
    open: boolean;
    title?: string;
    onClose: () => void;
    children: React.ReactNode;
    width?: number | string;
};

export const Modal: React.FC<ModalProps> = ({ open, title, onClose, children, width = 520 }) => {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) return null;

    const style = { ['--modal-width' as any]: typeof width === 'number' ? `${width}px` : width };

    return ReactDOM.createPortal(
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" style={style} onClick={(e) => e.stopPropagation()}>
                {title ? (
                    <div className="modal-header">
                        <h3>{title}</h3>
                    </div>
                ) : null}
                <div className="modal-body">{children}</div>
            </div>
        </div>,
        document.body
    );
};