import {IRequest} from "mediatr-ts";

export class DownloadReport implements IRequest<void>{
    constructor(
        public readonly runId: string,
        public readonly format: string = "pdf",
    ) {
    }
}