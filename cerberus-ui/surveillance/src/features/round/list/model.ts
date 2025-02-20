export interface RoundSummary {
    id: string;
    description: string;
}

export const getRoundUrl = (round: RoundSummary) => `/surveillance/rounds/${round.id}`;
