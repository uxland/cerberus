import {IRequest, Mediator} from "mediatr-ts";
import {HandlerBase} from "@cerberus/core";
import {StartRun} from "../execution/start/command.ts";

export class AcquireRun implements IRequest<void> {
    constructor(public runId: string | undefined) { }
}

export class AcquireRunHandler extends HandlerBase<void, AcquireRun>{
    async handle({runId}: AcquireRun): Promise<void> {
       const {confirmed} = await this.interactionService.confirm("fddfdfdffdf")
        if(!confirmed) return;
        await new Mediator().send(new StartRun(runId));
        this.navigationService.navigateTo(`/surveillance/runs/${runId}`);
    }

}