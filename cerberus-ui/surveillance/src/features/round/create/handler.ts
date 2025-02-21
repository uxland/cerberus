import { store } from "@cerberus/core";
import { ApiClient } from "@cerberus/shared/src";
import { inject, injectable } from "inversify";
import { IRequestHandler } from "mediatr-ts";
import { CreateOperation } from "./command";

@injectable()
export class CreateRoundHandler implements IRequestHandler<CreateOperation, any> {
    constructor(@inject(ApiClient) private apiClient: ApiClient) { }

    async handle(command: CreateOperation): Promise<any> {
        try {
            const operation = await this.apiClient.post<any>("/operations", {
                body: command as any,
            });
            console.log('Operation created', operation);
            return operation;
        } catch (error) {
            console.error("Error creating operation:", error);
            throw error;
        }
    }
}