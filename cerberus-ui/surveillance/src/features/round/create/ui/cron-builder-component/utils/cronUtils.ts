
import { format, addMinutes, isValid } from 'date-fns';
import { es, enUS, ca } from 'date-fns/locale';
import { getLocale, SupportedLocale, Locale } from '../locales';

export interface CronValidation {
  isValid: boolean;
  error?: string;
}

const getDateFnsLocale = (locale: SupportedLocale) => {
  switch (locale) {
    case 'en':
      return enUS;
    case 'ca':
      return ca;
    case 'es':
    default:
      return es;
  }
};

export const validateCron = (expression: string, locale: SupportedLocale = 'es'): CronValidation => {
  const parts = expression.split(' ');
  const t = getLocale(locale);

  if (parts.length !== 5) {
    return { isValid: false, error: t.validations.mustHave5Parts };
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  // Validate minute (0-59)
  if (!isValidField(minute, 0, 59)) {
    return { isValid: false, error: t.validations.invalidMinutes };
  }

  // Validate hour (0-23)
  if (!isValidField(hour, 0, 23)) {
    return { isValid: false, error: t.validations.invalidHours };
  }

  // Validate day of month (1-31)
  if (!isValidField(dayOfMonth, 1, 31)) {
    return { isValid: false, error: t.validations.invalidDayOfMonth };
  }

  // Validate month (1-12)
  if (!isValidField(month, 1, 12)) {
    return { isValid: false, error: t.validations.invalidMonth };
  }

  // Validate day of week (0-6)
  if (!isValidField(dayOfWeek, 0, 6)) {
    return { isValid: false, error: t.validations.invalidDayOfWeek };
  }

  return { isValid: true };
};

const isValidField = (field: string, min: number, max: number): boolean => {
  if (field === '*') return true;

  // Handle intervals (*/5)
  if (field.includes('/')) {
    const [base, interval] = field.split('/');
    if (base !== '*') return false;
    const intervalNum = parseInt(interval);
    return !isNaN(intervalNum) && intervalNum > 0 && intervalNum <= max;
  }

  // Handle ranges (1-5)
  if (field.includes('-')) {
    const [start, end] = field.split('-');
    const startNum = parseInt(start);
    const endNum = parseInt(end);
    return !isNaN(startNum) && !isNaN(endNum) &&
      startNum >= min && endNum <= max && startNum <= endNum;
  }

  // Handle lists (1,3,5)
  if (field.includes(',')) {
    const values = field.split(',');
    return values.every(value => {
      const num = parseInt(value);
      return !isNaN(num) && num >= min && num <= max;
    });
  }

  // Handle single values
  const num = parseInt(field);
  return !isNaN(num) && num >= min && num <= max;
};

export const cronToDescription = (expression: string, locale: SupportedLocale = 'es'): string => {
  try {
    const [minute, hour, dayOfMonth, month, dayOfWeek] = expression.split(' ');
    const t = getLocale(locale);

    // Handle common patterns
    if (expression === '* * * * *') {
      return t.cronDescriptions.everyMinute;
    }

    if (minute === '0' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return t.cronDescriptions.everyHourAtMinute;
    }

    if (minute === '0' && hour === '0' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return t.cronDescriptions.everyDayAtMidnight;
    }

    if (dayOfWeek === '1-5') {
      return `${formatTime(minute, hour, t)} ${t.cronDescriptions.weekdaysAt}`;
    }

    if (dayOfWeek === '0,6') {
      return `${formatTime(minute, hour, t)} ${t.cronDescriptions.weekendsAt}`;
    }

    let description = '';

    // Time part
    if (minute !== '*' || hour !== '*') {
      description += formatTime(minute, hour, t);
    } else {
      description += t.cronDescriptions.everyMinute;
    }

    // Day restrictions
    const dayRestrictions = [];

    if (dayOfMonth !== '*') {
      dayRestrictions.push(formatDayOfMonth(dayOfMonth, t));
    }

    if (dayOfWeek !== '*') {
      dayRestrictions.push(formatDayOfWeek(dayOfWeek, t));
    }

    if (month !== '*') {
      dayRestrictions.push(formatMonth(month, t));
    }

    if (dayRestrictions.length > 0) {
      description += ', ' + dayRestrictions.join(', ');
    }

    return description;
  } catch (error) {
    const t = getLocale(locale);
    return t.invalidCron;
  }
};

const formatTime = (minute: string, hour: string, t: Locale): string => {
  if (minute === '*' && hour === '*') {
    return t.cronDescriptions.everyMinute;
  }

  if (minute.includes('/')) {
    const interval = minute.split('/')[1];
    return `${t.cronDescriptions.everyNMinutes} ${interval} ${t.cronDescriptions.minutes}`;
  }

  if (hour.includes('/')) {
    const interval = hour.split('/')[1];
    return `${t.cronDescriptions.everyNHours} ${interval} ${t.cronDescriptions.hours}`;
  }

  const minuteNum = minute === '*' ? '00' : minute.padStart(2, '0');
  const hourNum = hour === '*' ? 'XX' : hour.padStart(2, '0');

  if (hour === '*') {
    return `${t.cronDescriptions.inMinute} ${minuteNum} ${t.cronDescriptions.ofEveryHour}`;
  }

  if (minute === '*') {
    return `${t.cronDescriptions.everyMinuteOf} ${hourNum}:XX`;
  }

  return `${t.cronDescriptions.atTime} ${hourNum}:${minuteNum}`;
};

const formatDayOfMonth = (dayOfMonth: string, t: Locale): string => {
  if (dayOfMonth.includes(',')) {
    const days = dayOfMonth.split(',');
    return `${t.cronDescriptions.onDays} ${days.join(', ')} ${t.cronDescriptions.ofTheMonth}`;
  }

  if (dayOfMonth.includes('-')) {
    const [start, end] = dayOfMonth.split('-');
    return `${t.cronDescriptions.fromDay} ${start} ${t.cronDescriptions.toDay} ${end} ${t.cronDescriptions.ofTheMonth}`;
  }

  if (dayOfMonth.includes('/')) {
    const interval = dayOfMonth.split('/')[1];
    return `${t.cronDescriptions.everyNDays} ${interval} ${t.cronDescriptions.days}`;
  }

  return `${t.cronDescriptions.onDay} ${dayOfMonth} ${t.cronDescriptions.ofTheMonth}`;
};

const formatDayOfWeek = (dayOfWeek: string, t: Locale): string => {
  if (dayOfWeek.includes(',')) {
    const days = dayOfWeek.split(',').map(d => t.weekdaysLowercase[parseInt(d)]);
    return days.join(', ');
  }

  if (dayOfWeek.includes('-')) {
    const [start, end] = dayOfWeek.split('-');
    return `${t.cronDescriptions.from} ${t.weekdaysLowercase[parseInt(start)]} ${t.cronDescriptions.to} ${t.weekdaysLowercase[parseInt(end)]}`;
  }

  return t.weekdaysLowercase[parseInt(dayOfWeek)];
};

const formatMonth = (month: string, t: Locale): string => {
  if (month.includes(',')) {
    const months = month.split(',').map(m => t.monthsLowercase[parseInt(m)]);
    return `${t.cronDescriptions.in} ${months.join(', ')}`;
  }

  if (month.includes('-')) {
    const [start, end] = month.split('-');
    return `${t.cronDescriptions.from} ${t.monthsLowercase[parseInt(start)]} ${t.cronDescriptions.to} ${t.monthsLowercase[parseInt(end)]}`;
  }

  return `${t.cronDescriptions.in} ${t.monthsLowercase[parseInt(month)]}`;
};

export const getNextExecutions = (expression: string, count: number = 5, locale: SupportedLocale = 'es'): string[] => {
  try {
    const t = getLocale(locale);
    const dateFnsLocale = getDateFnsLocale(locale);

    // This is a simplified version - in a real app you'd want to use a proper CRON parser
    const now = new Date();
    const executions: string[] = [];

    // For demo purposes, we'll generate some sample dates
    // In production, use a library like node-cron or cron-parser
    let nextDate = new Date(now);

    for (let i = 0; i < count; i++) {
      nextDate = addMinutes(nextDate, 15); // Simplified calculation
      executions.push(format(nextDate, 'PPpp', { locale: dateFnsLocale }));
    }

    return executions;
  } catch (error) {
    const t = getLocale(locale);
    return [t.cronDescriptions.errorCalculating];
  }
};

// Preset common CRON expressions
export const CRON_PRESETS = {
  everyMinute: '* * * * *',
  everyHour: '0 * * * *',
  everyDay: '0 0 * * *',
  everyWeek: '0 0 * * 0',
  everyMonth: '0 0 1 * *',
  weekdays: '0 9 * * 1-5',
  weekends: '0 10 * * 0,6',
  hourly: '0 * * * *',
  daily: '0 0 * * *',
  weekly: '0 0 * * 0',
  monthly: '0 0 1 * *',
  yearly: '0 0 1 1 *',
};



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
