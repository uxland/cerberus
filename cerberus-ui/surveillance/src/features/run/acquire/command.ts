import { IRequest } from "mediatr-ts";

export class AcquireRun implements IRequest<void> {
    constructor(public runId: string | undefined) { }
}

