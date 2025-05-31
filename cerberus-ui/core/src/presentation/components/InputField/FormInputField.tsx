import React from "react";
import { FieldError } from "react-hook-form";
import { DeleteOutline } from "@mui/icons-material";

type InputFieldProps = {
    label?: string;
    name: string;
    type?: string;
    register?: any;
    placeholder?: string;
    error?: FieldError;
    disabled?: boolean;
    onDelete?: () => void;
    defaultValue?: string | number;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export const FormInputField: React.FC<InputFieldProps> = ({
    label,
    name,
    type = "text",
    register,
    placeholder,
    error,
    disabled = false,
    onDelete,
    defaultValue,
    onChange
}) => {
    const registration = register ? register(name) : {};

    return (
        <div className={`flex flex-col flex-1 gap-2 ${disabled ? 'opacity-75' : ''}`}>
            {label && (
                <div className="flex items-center relative">
                    <label htmlFor={name} className="block">{label}</label>
                    {onDelete && (
                        <button
                            type="button"
                            onClick={onDelete}
                            className={`text-red-500 hover:text-red-700 text-xs p-1 rounded-full absolute right-0`}
                        >
                            <DeleteOutline />
                        </button>
                    )}
                </div>
            )}
            <input
                id={name}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                aria-disabled={disabled}
                className={`w-full h-10 p-3 bg-[#313131] text-[#f7f7f7] border border-[#4a4a4a] rounded placeholder:text-[#929292]`}
                {...registration}
                defaultValue={defaultValue}
                {...(defaultValue !== undefined ? { defaultValue } : {})}
                {...(onChange ? { onChange } : {})}
            />
            {error && <p className="error text-red-500">{error.message}</p>}
        </div>
    );
};
