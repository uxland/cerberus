import {interfaces, injectable, inject, Container} from "inversify";
import * as React from "react";

export interface ConfirmationResult<T = undefined>{
    confirmed: boolean
    result: T | undefined;
}

export interface ConfirmationContentProps<TData, TResult = undefined>{
    data: TData | undefined
    setResult: (result: TResult) => void
    setIsValid: (isValid: boolean) => void,
    confirm: () => void,
    cancel: () => void,
}

export interface ConfirmationOptions{
    title?: string | undefined,
    showTitle?: boolean | undefined,
    showConfirmButton?: boolean | undefined,
    showCancelButton?: boolean | undefined,
    confirmButtonText?: string | undefined,
    cancelButtonText?: string | undefined,
}

@injectable()
export abstract class InteractionService {
    constructor(@inject(Container) protected  container: Container) {
    }
    abstract confirm<TData = undefined, TResult = undefined>(
        data: TData | undefined,
        dialogKey: interfaces.ServiceIdentifier<React.ComponentType<ConfirmationContentProps<TData, TResult>>>,
        options?: ConfirmationOptions | undefined
    ): Promise<ConfirmationResult<TResult | undefined>>
    abstract confirmMessage(
        message: string,
        options?: ConfirmationOptions | undefined
    ): Promise<ConfirmationResult>
}