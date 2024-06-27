export const constantBuilder: (prefix: string, suffix?: string, separator?: string) => (constant: string) => string =
    (prefix, suffix, separator = '::') =>
        constant =>
            `${prefix}${separator}${constant}${suffix ? `${separator}${suffix}` : ''}`;