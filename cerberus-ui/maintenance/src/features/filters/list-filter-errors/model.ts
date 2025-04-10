import * as dfns from 'date-fns';

export type ErrorType = "False Positive" | "False Negative";

export interface FilterError {
    date: Date;
    type: ErrorType;
    cameraId: string;
    brandName: string;
    modelName: string;
    manufactureYear: string;
    filterDescription: string;
}

export interface FilterErrorView {
    date: string;
    errorType: ErrorType;
    camera: string;
    brandName: string;
    modelName: string;
    year: string;
    filterDescription: string;
}


const generateMockFilterError = (date: Date): FilterError => {
    const errorTypes: ErrorType[] = ["False Positive", "False Negative"];
    const filterDescriptions: string[] = ["blur", "blobs"];
    const randomErrorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];
    const filterDescription = filterDescriptions[Math.floor(Math.random() * filterDescriptions.length)];

    const brandNames = ["Sony", "Nikkon", "Panasonic"];
    const randomBrandName = brandNames[Math.floor(Math.random() * brandNames.length)];

    return {
        date,
        type: randomErrorType,
        cameraId: `camera-${Math.floor(Math.random() * 100)}`,
        brandName: randomBrandName,
        modelName: `Model-${Math.floor(Math.random() * 10)}`,
        manufactureYear: `${2000 + Math.floor(Math.random() * 22)}`,
        filterDescription: filterDescription
    };
};

const generateMockFilterErrors = (days: number, errorsPerDay: number): FilterError[] => {
    const errors: FilterError[] = [];
    const currentDate = new Date();

    for (let i = 0; i < days; i++) {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() - i);
        date.setHours(12, 0, 0, 0); // Set time to noon

        for (let j = 0; j < errorsPerDay; j++) {
            errors.push(generateMockFilterError(date));
        }
    }

    return errors;
};

// Example usage
const mockFilterErrors = generateMockFilterErrors(21, 80); // 21 days, 8 errors per day


export type GroupBy = "Month" | "Week" | "Day";


const toFilterErrorView: (error: FilterError, format: string) => FilterErrorView = (error, format) => {
    return {
        ...error,
        date: dfns.format(error.date, format)
    }
}

const groupByDay: () => FilterErrorView[] = () => mockFilterErrors.map(e => toFilterErrorView(e, "dd/MM/yyyy"));

const groupByMonth: () => FilterErrorView[] = () => mockFilterErrors.map(error => toFilterErrorView(error, "MM/yyyy"));

const groupByWeek: () => FilterErrorView[] = () => mockFilterErrors.map(error => toFilterErrorView(error, "w/yyyy"));

export const getMockFilterErrors = (group: GroupBy) => {
    switch (group) {
        case "Week":
            return groupByWeek();
        case "Month":
            return groupByMonth();
        case "Day":
            return groupByDay();
    }
}