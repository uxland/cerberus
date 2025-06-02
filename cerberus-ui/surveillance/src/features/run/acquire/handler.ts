import { HandlerBase } from "@cerberus/core";
import { AcquireRun } from "./command.ts";
import { locales } from "../../../locales/ca/locales.ts";

interface ClaimRunResult {
    success: boolean;
    id: string | undefined;
    errorMessage: string | undefined;
}

const moduleName = "surveillance";

export class AcquireRunHandler extends HandlerBase<void, AcquireRun> {
    async handle(cmd: AcquireRun): Promise<void> {
        if (!(await this.askForConfirmation(cmd))) return;
        if (!(await this.claimRun(cmd))) return;
        this.navigationService.navigateTo(`/surveillance/runs/${cmd.runId}`);
    }

    private async askForConfirmation(cmd: AcquireRun): Promise<boolean> {
        const messageTemplate = locales[moduleName].run.acquire.messageWithName;
        const message = messageTemplate.replace("{description}", cmd.description);

        const options = {
            confirmButtonText: locales[moduleName].run.acquire.confirmButton,
            cancelButtonText: locales[moduleName].run.acquire.cancelButton,
            title: locales[moduleName].run.acquire.title
        };

        const { confirmed } = await this.interactionService.confirmMessage(message, options);
        return confirmed;
    }

    private async claimRun(cmd: AcquireRun): Promise<boolean> {
        const result = await this.apiClient.put<ClaimRunResult>(`surveillance/runs/${cmd.runId}:claim`, {});
        if (!result.success)
            this.notificationService.notifyError(result.errorMessage);
        return result.success;
    }
}
