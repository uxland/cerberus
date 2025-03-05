
import { IRequest } from "mediatr-ts";

export class CreateRun implements IRequest<string> {
    constructor(public roundId: string | undefined) { }
}



