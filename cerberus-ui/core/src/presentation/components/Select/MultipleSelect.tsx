import React, { useState, useEffect } from 'react';
import Typography from "@mui/material/Typography";
import { FieldError, UseFormReturn } from "react-hook-form";

interface MultipleSelectProps {
    title: string;
    options: { value: string; label: string }[];
    selected?: string[];
    classes?: string;
    path?: string;
    name?: string;
    onChanged?: (values: string[]) => void;
    formMethods?: UseFormReturn<unknown>;
    error?: FieldError;
}

export const MultipleSelect = ({ title, options, classes, path, name, selected, onChanged, formMethods, error }: MultipleSelectProps) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>(selected || []);
    const { watch, setValue } = formMethods || {};
    const selectedValues = selected || (name && path && watch && watch(`${path}.${name}`));

    useEffect(() => {
        if (Array.isArray(selectedValues)) {
            setSelectedOptions(selectedValues);
        } else if (selectedValues) {
            setSelectedOptions([selectedValues]);
        }
    }, [selectedValues]);

    const handleOptionClick = (optionValue: string) => {
        let newSelectedOptions: string[];

        if (selectedOptions.includes(optionValue)) {
            newSelectedOptions = selectedOptions.filter(value => value !== optionValue);
        } else {
            newSelectedOptions = [...selectedOptions, optionValue];
        }

        setSelectedOptions(newSelectedOptions);

        if (onChanged) {
            onChanged(newSelectedOptions);
        } else if (formMethods && path && name) {
            setValue(`${path}.${name}`, newSelectedOptions);
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
                        className={`px-4 py-2 rounded-md text-sm font-medium ${selectedOptions.includes(option.value)
                            ? 'bg-formSelect text-gray-900'
                            : 'bg-primaryGray border border-formSelect text-formSelect hover:bg-gray-600'
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