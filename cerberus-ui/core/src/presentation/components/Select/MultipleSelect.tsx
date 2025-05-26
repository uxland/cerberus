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
    disabled?: boolean;
    size?: 'small' | 'medium' | 'large';
    theme?: 'default' | 'gray';
}

export const MultipleSelect = ({ title, options, classes, path, name, selected, onChanged, formMethods, error, disabled = false, size = 'medium', theme = 'default' }: MultipleSelectProps) => {
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
        if (disabled) return;

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

    const getSizeClasses = () => {
        switch (size) {
            case 'small':
                return 'px-2 py-1 text-xs';
            case 'large':
                return 'px-6 py-3 text-base';
            case 'medium':
            default:
                return 'px-4 py-2 text-sm';
        }
    };

    const getTitleSizeClass = () => {
        switch (size) {
            case 'small':
                return '!text-[10px]';
            case 'large':
                return '!text-sm';
            case 'medium':
            default:
                return '!text-xs';
        }
    };

    const getThemeClasses = () => {
        switch (theme) {
            case 'gray':
                return {
                    unselected: '',
                    selected: 'bg-formSelect text-gray-900',
                    unselectedStyle: {
                        backgroundColor: '#40444C',
                        borderColor: '#676E71',
                        color: "#ffc200"
                    },
                    selectedStyle: {
                        borderColor: '#B59019'
                    }
                };
            case 'default':
            default:
                return {
                    unselected: 'bg-primaryGray border border-formSelect text-formSelect',
                    selected: 'bg-formSelect text-gray-900 border border-formSelect',
                    unselectedStyle: {},
                    selectedStyle: {}
                };
        }
    };

    return (
        <div className={`flex flex-col gap-2 ${classes}`}>
            <Typography className={`uppercase !text-grey82 !font-semibold ${getTitleSizeClass()}`}>
                {title}
            </Typography>
            <div className={`flex flex-wrap gap-2 ${disabled ? 'opacity-75' : ''}`}>
                {options.map((option) => {
                    const themeClasses = getThemeClasses();
                    const isSelected = selectedOptions.includes(option.value);

                    return (
                        <button
                            type="button"
                            key={option.value}
                            className={`rounded-md font-medium border ${getSizeClasses()} ${isSelected
                                ? themeClasses.selected
                                : `${themeClasses.unselected} ${!disabled ? 'hover:bg-gray-600' : ''}`
                                }`}
                            style={{
                                ...(isSelected ? themeClasses.selectedStyle : themeClasses.unselectedStyle)
                            }}
                            onClick={() => handleOptionClick(option.value)}
                            disabled={disabled}
                            aria-disabled={disabled}
                        >
                            {option.label}
                        </button>
                    );
                })}
                {error && <p className="error text-red-500">{error.message}</p>}
            </div>
        </div>
    );
};