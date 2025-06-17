import { CronTheme } from '../types/cronTheme';

export const defaultTheme: CronTheme = {
    primary: '#222F3E',
    secondary: '#8B93A5',
    surface: '#FFFFFF',
    border: '#E5E7EB',
    text: {
        primary: '#111827',
        secondary: '#6B7280',
        muted: '#9CA3AF',
    },
    button: {
        background: '#FFFFFF',
        hover: '#F9FAFB',
        text: '#111827',
        border: '#E5E7EB',
    },
    popover: {
        background: '#FFFFFF',
        border: '#E5E7EB',
        shadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    },
    checkbox: {
        background: '#FFFFFF',
        border: '#D1D5DB',
        checked: '#222F3E',
        checkmark: '#FFFFFF',
    },
    scroll: {
        track: 'rgba(156, 163, 175, 0.3)',
        thumb: 'rgba(107, 114, 128, 0.4)',
        thumbHover: 'rgba(107, 114, 128, 0.6)',
    },
    badge: {
        background: '#F3F4F6',
        text: '#374151',
        border: '#E5E7EB',
    },
    input: {
        background: '#FFFFFF',
        border: '#D1D5DB',
        focus: '#3B82F6',
        text: '#111827',
    },
    select: {
        background: '#FFFFFF',
        border: '#D1D5DB',
        hover: '#F9FAFB',
        text: '#111827',
    },
    cssVariables: {
        '--cron-primary': '#222F3E',
        '--cron-surface': '#FFFFFF',
    },
};

export const darkTheme: CronTheme = {
    primary: '#3B82F6',
    secondary: '#6B7280',
    surface: '#1E293B',
    border: '#334155',
    text: {
        primary: '#F1F5F9',
        secondary: '#94A3B8',
        muted: '#64748B',
    },
    button: {
        background: '#1E293B',
        hover: '#334155',
        text: '#F1F5F9',
        border: '#475569',
    },
    popover: {
        background: '#1E293B',
        border: '#475569',
        shadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    },
    checkbox: {
        background: '#1E293B',
        border: '#475569',
        checked: '#3B82F6',
        checkmark: '#F1F5F9',
    },
    scroll: {
        track: '#334155',
        thumb: '#64748B',
        thumbHover: '#94A3B8',
    },
    badge: {
        background: '#374151',
        text: '#F3F4F6',
        border: '#4B5563',
    },
    input: {
        background: '#1E293B',
        border: '#475569',
        focus: '#3B82F6',
        text: '#F1F5F9',
    },
    select: {
        background: '#1E293B',
        border: '#475569',
        hover: '#334155',
        text: '#F1F5F9',
    },
    cssVariables: {
        '--cron-primary': '#3B82F6',
        '--cron-surface': '#1E293B',
    },
};

export const cerberusTheme: CronTheme = {
    primary: '#FDB813',
    secondary: '#4A4A4A',
    surface: '#2D2D2D',
    border: '#404040',
    text: {
        primary: '#FFFFFF',
        secondary: '#B0B0B0',
        muted: '#808080',
    },
    button: {
        background: '#2D2D2D',
        hover: '#3A3A3A',
        text: '#FFFFFF',
        border: '#404040',
    },
    popover: {
        background: '#2D2D2D',
        border: '#404040',
        shadow: '0 25px 50px -12px rgb(253 184 19 / 0.15)',
    },
    checkbox: {
        background: '#2D2D2D',
        border: '#404040',
        checked: '#FFD700',
        checkmark: '#000000',
    },
    scroll: {
        track: '#3A3A3A',
        thumb: '#4A4A4A',
        thumbHover: '#FDB813',
    },
    badge: {
        background: '#FDB813',
        text: '#1A1A1A',
        border: '#E6A500',
    },
    input: {
        background: '#2D2D2D',
        border: '#404040',
        focus: '#FDB813',
        text: '#FFFFFF',
    },
    select: {
        background: '#2D2D2D',
        border: '#404040',
        hover: '#3A3A3A',
        text: '#FFFFFF',
    },
    cssVariables: {
        '--cron-primary': '#FDB813',
        '--cron-surface': '#2D2D2D',
        '--cron-event-text': '#1A1A1A',
    },
};
