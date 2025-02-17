import { IRequestHandler } from "mediatr-ts";
import { ListOperations } from "./query.ts";
import { OperationSummary } from "./model.ts";
import { ApiClient } from "@cerberus/shared/src";
import { inject, injectable } from "inversify";

@injectable()
export class ListOperationsHandler implements IRequestHandler<ListOperations, OperationSummary[]> {
    constructor(@inject(ApiClient) private apiClient: ApiClient) {
    }
    async handle(query: ListOperations): Promise<OperationSummary[]> {
        const item: { path: string } = await this.apiClient.get(`hierarchy-items/${query.id}`);
        return await this.apiClient.get<OperationSummary[]>(`/operations/${item.path}/surveillance-operations`); // ???
    }
}