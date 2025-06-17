import { Locale } from './es';

export const en: Locale = {
    // Field labels
    minutes: 'Minutes',
    hours: 'Hours',
    dayOfMonth: 'Day of month',
    month: 'Month',
    dayOfWeek: 'Day of week',

    // Frequency presets
    minutely: 'Every minute',
    hourly: 'Every hour',
    daily: 'Every day',
    weekly: 'Every week',
    monthly: 'Every month',
    yearly: 'Every year',

    // Field types
    every: 'Every',
    specific: 'Specific values',
    range: 'Range',
    interval: 'Every X',

    // Months
    months: {
        jan: 'JAN',
        feb: 'FEB',
        mar: 'MAR',
        apr: 'APR',
        may: 'MAY',
        jun: 'JUN',
        jul: 'JUL',
        aug: 'AUG',
        sep: 'SEP',
        oct: 'OCT',
        nov: 'NOV',
        dec: 'DEC',
    },

    monthsFull: {
        january: 'January',
        february: 'February',
        march: 'March',
        april: 'April',
        may: 'May',
        june: 'June',
        july: 'July',
        august: 'August',
        september: 'September',
        october: 'October',
        november: 'November',
        december: 'December',
    },

    monthsLowercase: [
        '', 'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
    ],

    // Weekdays
    weekdays: {
        sun: 'SUN',
        mon: 'MON',
        tue: 'TUE',
        wed: 'WED',
        thu: 'THU',
        fri: 'FRI',
        sat: 'SAT',
    },

    weekdaysFull: {
        sunday: 'Sunday',
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
    },

    weekdaysLowercase: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],

    // Interface
    selectValues: 'Select values:',
    selected: 'selected',
    selectedPlural: 'selected',
    values: 'Values:',
    clear: 'Clear',
    reset: 'Reset',
    rangeLabel: 'Range:',
    everyLabel: 'Every:',
    tooltip: 'Adjust specific values for your selected frequency',
    nextExecutions: 'Next executions:',
    invalidCron: 'Invalid CRON expression',

    // CRON descriptions
    cronDescriptions: {
        everyMinute: 'Every minute',
        everyHourAtMinute: 'Every hour on the hour',
        everyDayAtMidnight: 'Every day at midnight',
        weekdaysAt: 'Monday through Friday',
        weekendsAt: 'on weekends',
        atTime: 'At',
        inMinute: 'At minute',
        ofEveryHour: 'of every hour',
        everyMinuteOf: 'Every minute of',
        everyNMinutes: 'Every',
        minutes: 'minutes',
        everyNHours: 'Every',
        hours: 'hours',
        onDays: 'on days',
        ofTheMonth: 'of the month',
        fromDay: 'from day',
        toDay: 'to',
        everyNDays: 'every',
        days: 'days',
        onDay: 'on day',
        from: 'from',
        to: 'to',
        in: 'in',
        and: 'and',
        errorCalculating: 'Error calculating next executions',
    },

    // Validations
    validations: {
        mustHave5Parts: 'CRON expression must have 5 parts',
        invalidMinutes: 'Invalid minutes (0-59)',
        invalidHours: 'Invalid hours (0-23)',
        invalidDayOfMonth: 'Invalid day of month (1-31)',
        invalidMonth: 'Invalid month (1-12)',
        invalidDayOfWeek: 'Invalid day of week (0-6)',
    },
};
