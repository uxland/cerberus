
import { RequestBase } from "@cerberus/core";
import { IRequest } from "mediatr-ts";

export class CreateRun extends RequestBase<string> implements IRequest<string> {
    constructor(public roundId: string | undefined) {
        super();
    }
}



