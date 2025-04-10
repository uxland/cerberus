import { IRequest, INotification } from "mediatr-ts";

export class AcquireRun implements IRequest<void> {
    constructor(public runId: string | undefined, public description: string , public roundId: string) { }
}