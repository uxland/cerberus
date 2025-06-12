export interface CronTheme {
    primary: string;
    secondary: string;
    surface: string;
    border: string;
    text: {
        primary: string;
        secondary: string;
        muted: string;
    };
    button: {
        background: string;
        hover: string;
        text: string;
        border: string;
    };
    popover: {
        background: string;
        border: string;
        shadow: string;
    };
    checkbox: {
        background: string;
        border: string;
        checked: string;
        checkmark: string;
    };
    scroll: {
        track: string;
        thumb: string;
        thumbHover: string;
    };
    badge: {
        background: string;
        text: string;
        border: string;
    };
    input: {
        background: string;
        border: string;
        focus: string;
        text: string;
    };
    select: {
        background: string;
        border: string;
        hover: string;
        text: string;
    };
    cssVariables: Record<string, string>;
}
