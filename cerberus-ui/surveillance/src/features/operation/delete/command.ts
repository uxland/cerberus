import { IRequest } from "mediatr-ts";

export class DeleteOperation implements IRequest<void> {
    constructor(public id: string) { }
}