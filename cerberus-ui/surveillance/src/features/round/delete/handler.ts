import { HandlerBase } from "@cerberus/core";
import { DeleteRound } from "./command";
import { roundsEndpointUrl } from "../constants";
import { injectable } from "inversify";

@injectable()
export class DeleteRoundHandler extends HandlerBase<void, DeleteRound> {
    handle(request: DeleteRound): Promise<void> {
        return this.deleteRound(request);
    }

    deleteRound(request: DeleteRound): Promise<void> {
        return this.apiClient.delete(`${roundsEndpointUrl}${request.id}`);
    }
}