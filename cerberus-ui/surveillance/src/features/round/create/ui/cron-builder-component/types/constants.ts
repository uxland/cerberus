import { FrequencyPreset, FieldConfig } from './cronBuilder';

export const defaultFieldConfig: FieldConfig = {
    type: 'every',
    value: '*',
    specificValues: [],
    rangeStart: 0,
    rangeEnd: 0,
    intervalValue: 1,
};

export const MONTHS = [
    { value: 1, label: 'jan', fullName: 'january' },
    { value: 2, label: 'feb', fullName: 'february' },
    { value: 3, label: 'mar', fullName: 'march' },
    { value: 4, label: 'apr', fullName: 'april' },
    { value: 5, label: 'may', fullName: 'may' },
    { value: 6, label: 'jun', fullName: 'june' },
    { value: 7, label: 'jul', fullName: 'july' },
    { value: 8, label: 'aug', fullName: 'august' },
    { value: 9, label: 'sep', fullName: 'september' },
    { value: 10, label: 'oct', fullName: 'october' },
    { value: 11, label: 'nov', fullName: 'november' },
    { value: 12, label: 'dec', fullName: 'december' },
];

export const WEEKDAYS = [
    { value: 0, label: 'sun', fullName: 'sunday' },
    { value: 1, label: 'mon', fullName: 'monday' },
    { value: 2, label: 'tue', fullName: 'tuesday' },
    { value: 3, label: 'wed', fullName: 'wednesday' },
    { value: 4, label: 'thu', fullName: 'thursday' },
    { value: 5, label: 'fri', fullName: 'friday' },
    { value: 6, label: 'sat', fullName: 'saturday' },
];

export const FREQUENCY_PRESETS = [
    { value: 'minutely', label: 'minutely', cron: '* * * * *' },
    { value: 'hourly', label: 'hourly', cron: '0 * * * *' },
    { value: 'daily', label: 'daily', cron: '0 0 * * *' },
    { value: 'weekly', label: 'weekly', cron: '0 0 * * 0' },
    { value: 'monthly', label: 'monthly', cron: '0 0 1 * *' },
    { value: 'yearly', label: 'yearly', cron: '0 0 1 1 *' },
];

export const getVisibleFields = (preset: FrequencyPreset): string[] => {
    switch (preset) {
        case 'minutely':
            return [];
        case 'hourly':
            return ['minutes'];
        case 'daily':
            return ['hours', 'minutes'];
        case 'weekly':
            return ['dayOfWeek', 'hours', 'minutes'];
        case 'monthly':
            return ['dayOfMonth', 'hours', 'minutes'];
        case 'yearly':
            return ['month', 'dayOfMonth', 'hours', 'minutes'];
        default:
            return ['month', 'dayOfMonth', 'hours', 'minutes'];
    }
};
