import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 relative w-[90%] max-w-xl max-h-[90%] overflow-y-auto">
        <button
            onClick={onClose}
            className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-gray-900"
        >
            ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
