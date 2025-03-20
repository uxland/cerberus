import {IRequest} from "mediatr-ts";

export class ReleaseRun implements IRequest<void> {
    constructor(public id: string, public readonly additionalComments?: string | undefined) { }
}

