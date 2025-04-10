import { IRequest } from "mediatr-ts";

export class DeleteRound implements IRequest<void> {
    constructor(public id: string) { }
}