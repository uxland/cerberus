import React, { useState, useEffect } from 'react';
import Typography from "@mui/material/Typography";
import { FieldError, UseFormReturn } from "react-hook-form";

interface SelectProps {
    title: string;
    options: { value: string; label: string }[];
    selected?: string;
    classes?: string;
    path?: string;
    name?: string;
    onChanged?: (value: string) => void;
    formMethods?: UseFormReturn<unknown>;
    error?: FieldError;
}

export const Select = ({ title, options, classes, path, name, selected, onChanged, formMethods, error }: SelectProps) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(selected || null);
    const { watch, setValue } = formMethods || {};
    const selectedValue = selected || (name && path && watch && watch(`${path}.${name}`));

    useEffect(() => {
        setSelectedOption(selectedValue || null);
    }, [selectedValue]);

    const handleOptionClick = (optionValue: string) => {
        const parsedValue =
            optionValue === "true" ? true : optionValue === "false" ? false : optionValue;
        setSelectedOption(optionValue);
        if (onChanged) {
            onChanged(parsedValue);
        } else if (formMethods && path && name) {
            setValue(`${path}.${name}`, parsedValue);
        }
    };

    return (
        <div className={`flex flex-col gap-2 ${classes}`}>
            <Typography className="!text-xs uppercase !text-grey82 !font-semibold">
                {title}
            </Typography>
            <div className="flex flex-wrap gap-2">
                {options.map((option) => (
                    <button
                        type="button"
                        key={option.value}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${selectedOption === option.value ? 'bg-formSelect text-gray-900' : 'bg-primaryGray border border-formSelect text-formSelect hover:bg-gray-600'
                            }`}
                        onClick={() => handleOptionClick(option.value)}
                    >
                        {option.label}
                    </button>
                ))}
                {error && <p className="error text-red-500">{error.message}</p>}

            </div>
        </div>
    );
};