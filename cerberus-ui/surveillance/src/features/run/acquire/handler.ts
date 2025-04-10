import { HandlerBase } from "@cerberus/core";

import {AcquireRun, RunCreated} from "./command.ts";
import { INotificationHandler } from "mediatr-ts";



interface ClaimRunResult{
  success: boolean;
  id: string | undefined;
  errorMessage: string | undefined;
}

export class AcquireRunHandler extends HandlerBase<void, AcquireRun> {
    async handle(cmd: AcquireRun): Promise<void> {
        if(! (await this.askForConfirmation(cmd))) return;
        if(! (await this.claimRun(cmd))) return;
        this.navigationService.navigateTo(`/surveillance/runs/${cmd.runId}`);
    }

    private async askForConfirmation(cmd: AcquireRun): Promise<boolean> {
        const message = "¿Quieres comenzar ahora la ronda de supervisión?";
        const { confirmed } = await this.interactionService.confirmMessage(message);
        return confirmed;
    }

    private async claimRun(cmd: AcquireRun): Promise<boolean> {
        const result = await this.apiClient.put<ClaimRunResult>(`surveillance/runs/${cmd.runId}:claim`, {});
        if(!result.success)
            this.notificationService.notifyError(result.errorMessage)
        return result;
    }
}
