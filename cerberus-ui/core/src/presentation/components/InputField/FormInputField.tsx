import React from "react";
import { FieldError } from "react-hook-form";

type InputFieldProps = {
    label: string;
    name: string;
    type?: string;
    register?: any;
    placeholder?: string;
    error?: FieldError;
    disabled?: boolean;
};

export const FormInputField: React.FC<InputFieldProps> = ({
    label,
    name,
    type = "text",
    register,
    placeholder,
    error,
    disabled = false
}) => {
    return (
        <div className={`flex flex-col flex-1 gap-2 ${disabled ? 'opacity-75' : ''}`}>
            <label htmlFor={name}>{label}</label>
            <input
                id={name}
                type={type}
                placeholder={placeholder}
                {...register(name)}
                disabled={disabled}
                aria-disabled={disabled}
                className={`w-full h-10 p-3 bg-[#313131] text-[#f7f7f7] border border-[#a1a1a1] rounded placeholder:text-[#929292]`}
            />
            {error && <p className="error text-red-500">{error.message}</p>}
        </div>
    );
};
