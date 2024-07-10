import {IRequest, IRequestHandler} from "mediatr-ts";
import {inject, injectable} from "inversify";
import {ApiClient} from "@cerberus/shared/src";

export class CaptureSnapshots implements IRequest<void>{
    constructor(public locationId: string){
    }
}

@injectable()
export class Handler implements IRequestHandler<CaptureSnapshots, void>{
    constructor(@inject(ApiClient) private apiClient: ApiClient) {
    }
    handle({locationId}: CaptureSnapshots): Promise<void> {
        return this.apiClient.post(`captures/${locationId}`, {}).then(() => {});
    }

}