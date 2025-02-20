import React from "react";
import { FieldError } from "react-hook-form";

type InputFieldProps = {
    label: string;
    name: string;
    type?: string;
    register: any;
    placeholder?: string;
    error?: FieldError;
};

export const FormInputField: React.FC<InputFieldProps> = ({ label, name, type = "text", register, placeholder, error }) => {
    return (
        <div className={`flex flex-col flex-1 gap-2`}>
            <label htmlFor={name}>{label}</label>
            <input
                id={name}
                type={type}
                placeholder={placeholder}
                {...register(name)}
                className="w-full h-10 p-3 bg-[#313131] text-[#f7f7f7] border border-[#a1a1a1] rounded placeholder:text-[#929292]"
            />
            {error && <p className="error">{error.message}</p>}
        </div>
    );
};
