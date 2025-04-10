
import { IRequest } from "mediatr-ts";

export class GetRun implements IRequest<void> {
    constructor(public id: string | undefined) { }
}


