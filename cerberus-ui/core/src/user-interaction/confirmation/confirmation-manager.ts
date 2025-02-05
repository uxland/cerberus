import { Container, injectable } from "inversify";

export type ConfirmationResult  = "yes" | "no";

export interface ConfirmOptions<TPayload= undefined>{
    title?: string | undefined;
    titleTranslateParameters?: string[] | undefined;
    message?: string | undefined;
    messageTranslateParameters?: string[] | undefined;
    availableResponses?: ConfirmationResult[] | undefined;
    payload?: TPayload | undefined;
    componentId?: string | undefined;
}

@injectable()
export abstract class ConfirmationManager {
  abstract confirm<TPayload = undefined>(options: ConfirmOptions<TPayload>): Promise<ConfirmationResult>;
}