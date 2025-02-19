import React from "react";
import { FieldError } from "react-hook-form";

type InputFieldProps = {
    label: string;
    name: string;
    type?: string;
    register: any;
    error?: FieldError;
};

const InputField: React.FC<InputFieldProps> = ({ label, name, type = "text", register, error }) => {
    return (
        <div className="input-group">
            <label htmlFor={name}>{label}</label>
            <input id={name} type={type} {...register(name)} />
            {error && <p className="error">{error.message}</p>}
        </div>
    );
};

export const FormInputField = InputField;