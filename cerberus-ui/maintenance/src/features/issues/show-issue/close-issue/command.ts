import {IRequest, IRequestHandler} from "mediatr-ts";

export class Command implements IRequest<void>{
    constructor(public issueId: string, public observations?: string | undefined) {}
}

export class Handler implements IRequestHandler<Command, void>{
    handle(command: Command): Promise<void> {
        throw new Error("Method not implemented.");
    }

}