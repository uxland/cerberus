import { CronTheme } from './cronTheme';
import { SupportedLocale } from '../locales';

export interface CronBuilderProps {
    value?: string;
    onChange?: (expression: string) => void;
    showDescription?: boolean;
    showPreview?: boolean;
    showResult?: boolean;
    showFields?: {
        minutes?: boolean;
        hours?: boolean;
        dayOfMonth?: boolean;
        month?: boolean;
        dayOfWeek?: boolean;
    };
    labels?: {
        minutes?: string;
        hours?: string;
        dayOfMonth?: string;
        month?: string;
        dayOfWeek?: string;
    };
    className?: string;
    compact?: boolean;
    theme?: CronTheme;
    showPresets?: boolean;
    defaultPreset?: FrequencyPreset;
    locale?: SupportedLocale;
    showClearButton?: boolean;
}

export type FrequencyPreset = 'minutely' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface FieldConfig {
    type: 'every' | 'specific' | 'range' | 'interval';
    value: string;
    specificValues: number[];
    rangeStart: number;
    rangeEnd: number;
    intervalValue: number;
}

export interface NumericInputProps {
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
    className?: string;
    style?: React.CSSProperties;
}
