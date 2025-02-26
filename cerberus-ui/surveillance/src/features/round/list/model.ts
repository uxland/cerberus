export interface RoundSummary {
    id: string;
    description: string;
    assignedTo: string;
    cronExpression: string;
    rootLocationId: string;
}

export const getRoundUrl = (round: RoundSummary) => `/surveillance/rounds/${round.id}`;
