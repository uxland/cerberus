
import { IRequest } from "mediatr-ts";

export class CreateRun implements IRequest<string> {
    constructor(public locationId: string | undefined, public roundId: string | undefined) { }
}



