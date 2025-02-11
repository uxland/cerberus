import * as dfns from 'date-fns';

export type IssueStatus = 'open' | 'closed' | 'inProgress';

export interface IssueSummary {
    date: Date;
    status: IssueStatus;
    dedicatedEffort?: number | undefined;
    cameraId: string;
    brandName: string;
    modelName: string;
    manufactureYear: string;
    filterDescription: string;
}
export interface IssueSummaryView {
    date: string;
    status: IssueStatus;
    dedicatedEffort?: number | undefined;
    cameraId: string;
    brandName: string;
    modelName: string;
    manufactureYear: string;
    filterDescription: string;
}

const generateMockIssueSummary = (date: Date): IssueSummary => {
    const statuses: IssueStatus[] = ['open', 'closed', 'inProgress'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    const brandNames = ['Sony', 'Nikkon', 'Panasonic'];
    const randomBrandName = brandNames[Math.floor(Math.random() * brandNames.length)];

    const filterDescriptions = ['blur', 'blobs'];
    const randomFilterDescription = filterDescriptions[Math.floor(Math.random() * filterDescriptions.length)];

    const issueSummary: IssueSummary = {
        date,
        status: randomStatus,
        cameraId: `camera-${Math.floor(Math.random() * 100)}`,
        brandName: randomBrandName,
        modelName: `Model-${Math.floor(Math.random() * 10)}`,
        manufactureYear: `${2000 + Math.floor(Math.random() * 22)}`,
        filterDescription: randomFilterDescription,
    };

    if (randomStatus === 'closed') {
        issueSummary.dedicatedEffort = parseFloat((Math.random() * (300 - 15) + 15).toFixed(2));
    }

    return issueSummary;
};

const generateMockIssueSummaries = (days: number, issuesPerDay: number): IssueSummary[] => {
    const issues: IssueSummary[] = [];
    const currentDate = new Date();

    for (let i = 0; i < days; i++) {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() - i);
        date.setHours(12, 0, 0, 0); // Set time to noon

        for (let j = 0; j < issuesPerDay; j++) {
            issues.push(generateMockIssueSummary(date));
        }
    }

    return issues;
};

// Example usage
const mockIssueSummaries = generateMockIssueSummaries(30, 8); // 30 days, 8 issues per day
console.log(mockIssueSummaries);
const toView: (issue: IssueSummary, format: string) => IssueSummaryView = (issue, format) =>{ return{...issue, date: dfns.format(issue.date, format)}}

const groupByDay: ( ) => IssueSummaryView[] = () => mockIssueSummaries.map(e => toView(e, "dd/MM/yyyy"));
const groupByWeek: ( ) => IssueSummaryView[] = () => mockIssueSummaries.map(e => toView(e, "w/yyyy"));
const groupByMonth: ( ) => IssueSummaryView[] = () => mockIssueSummaries.map(e => toView(e, "MM/yyyy"));

export type GroupBy = "Day" | "Week" | "Month"

export const listIssues = (group: GroupBy = "Week") =>{
    switch (group ){
        case "Week":
            return groupByWeek()
        case "Day":
            return groupByDay()
        case "Month":
            return groupByMonth()
    }
}
