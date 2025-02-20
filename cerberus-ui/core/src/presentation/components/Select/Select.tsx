import React from 'react';
import Typography from "@mui/material/Typography";
import {UseFormReturn} from "react-hook-form";

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
    const { watch, setValue } = formMethods;
    const selectedValue = selected || name && path && watch(`${path}.${name}`);
    const setOption = (value: string) => {
       if(onChanged) onChanged(value);
       else setValue(`${path}.${name}`, value);
    }

    return (
        <div className={`flex flex-col flex-1 gap-2 ${classes}`}>
            <Typography className="!text-xs uppercase !text-grey82 !font-semibold">
                {title}
            </Typography>
            <div className="flex flex-wrap gap-2">
                <select
                    value={selectedValue || ""}
                    onChange={(e) => setOption(e.target.value)}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};