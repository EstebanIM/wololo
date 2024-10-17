import React from "react";

export const Form = ({ show, onClose, children }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative md:w-1/2 lg:w-1/3">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};
