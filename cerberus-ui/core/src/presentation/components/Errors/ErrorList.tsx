import React from 'react';
import { Alert } from '@mui/material';

interface ErrorListProps {
    errors: string[];
    show: boolean;
    title?: string;
    onClose?: () => void;
    className?: string;
}

export const ErrorList: React.FC<ErrorListProps> = ({
    errors,
    show,
    title = "Corrige los siguientes errores",
    onClose,
    className = ""
}) => {
    return (
        <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${show && errors.length > 0
                    ? 'max-h-96 opacity-100 mb-4'
                    : 'max-h-0 opacity-0 mb-0'
                } ${className}`}
        >
            {show && errors.length > 0 && (
                <Alert
                    severity="error"
                    onClose={onClose}
                    className="transition-all duration-300 ease-in-out"
                >
                    <div>
                        <strong>{title}:</strong>
                        <ul className="mt-2 ml-4">
                            {errors.map((error, index) => (
                                <li key={index} className="list-disc transition-all duration-200">
                                    {error}
                                </li>
                            ))}
                        </ul>
                    </div>
                </Alert>
            )}
        </div>
    );
};