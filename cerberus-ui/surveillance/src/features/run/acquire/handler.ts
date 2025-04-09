import { HandlerBase } from "@cerberus/core";
import { StartRun } from "../execution/start/command.ts";
import { AcquireRun } from "./command.ts";
import { Mediator } from "mediatr-ts";

export class AcquireRunHandler extends HandlerBase<void, AcquireRun> {
    async handle({ runId }: AcquireRun): Promise<void> {
        const message = "¿Quieres comenzar ahora la ronda de supervisión?";
        const { confirmed } = await this.interactionService.confirmMessage(message);
        if (!confirmed) return;
        await new Mediator().send(new StartRun(runId));
        this.navigationService.navigateTo(`/surveillance/runs/${runId}`);
    }

}