import React, { useState } from 'react';
import Typography from "@mui/material/Typography";

interface SelectProps {
    title: string;
    options: string[];
    onSelect: (option: string) => void;
    classes?: string;
    selected?: string;
}

export const Select = ({ title, options, onSelect, classes, selected }: SelectProps) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(selected || null);

    const handleOptionClick = (option: string) => {
        setSelectedOption(option);
        onSelect(option);
    };

    return (
        <div className={`flex flex-col flex-1 gap-2 ${classes}`}>
            <Typography className="!text-xs uppercase !text-grey82 !font-semibold">
                {title}
            </Typography>
            <div className="flex flex-wrap gap-2">
                {options.map((option) => (
                    <button
                        key={option}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${selectedOption === option ? 'bg-formSelect text-gray-900' : 'bg-primaryGray border border-formSelect text-formSelect hover:bg-gray-600'
                            }`}
                        onClick={() => handleOptionClick(option)}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
};