import React, { useState, useEffect } from 'react';
import Typography from "@mui/material/Typography";
import { UseFormReturn } from "react-hook-form";

interface SelectProps {
    title: string;
    options: { value: string; label: string }[];
    selected?: string;
    classes?: string;
    path?: string;
    name?: string;
    onChanged?: (value: string) => void;
    formMethods?: UseFormReturn<unknown>;
}

export const Select = ({ title, options, classes, path, name, selected, onChanged, formMethods }: SelectProps) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(selected || null);
    const { watch, setValue } = formMethods || {};
    const selectedValue = selected || (name && path && watch && watch(`${path}.${name}`));

    useEffect(() => {
        setSelectedOption(selectedValue || null);
    }, [selectedValue]);

    const handleOptionClick = (optionValue: string) => {
        setSelectedOption(optionValue);
        if (onChanged) {
            onChanged(optionValue);
        } else if (formMethods && path && name) {
            setValue(`${path}.${name}`, optionValue);
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
            </div>
        </div>
    );
};