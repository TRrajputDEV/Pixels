// src/components/ui/Modal.jsx
import { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
                className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            
            <div className="relative z-10 w-full max-w-md bg-gradient-to-b from-gray-900 to-gray-950 border border-emerald-900/30 rounded-2xl shadow-2xl shadow-emerald-900/20 overflow-hidden">
                <div className="p-5 border-b border-emerald-900/30">
                    <h3 className="text-xl font-bold text-emerald-300">{title}</h3>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1 text-emerald-400 hover:text-emerald-300 rounded-full hover:bg-emerald-900/30 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;