export interface OperationSummary {
    id: string;
    description: string;
}

export const getOperationUrl = (operation: OperationSummary) => `/surveillance/operations/${operation.id}`;
