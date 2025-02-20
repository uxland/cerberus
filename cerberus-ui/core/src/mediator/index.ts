import * as media from "mediatr-ts";
import {
    INotification,
    INotificationHandler,
    IRequest,
    IRequestHandler,
    notificationHandler,
    requestHandler,
} from "mediatr-ts";
import {inject, injectable} from "inversify";
import {ApiClient} from "@cerberus/shared/src";
import {NavigationService} from "../routing";
import {SetState} from "../state";

interface Constructor<T> {
    new (...args: any[]): T;
}

export interface CommandHandlerPair{
    command: Constructor<IRequest<any>>;
    handler: Constructor<IRequestHandler<any, any>>;
}

export const registerCommandHandlers = (handlers: CommandHandlerPair[]) => handlers.forEach(({ command, handler }) => registerCommandHandler(command, handler));

export const registerCommandHandler = <
    TResponse,
    TCommand extends IRequest<TResponse>,
    THandler extends IRequestHandler<TCommand, TResponse>,
>(
    commandConstructor: Constructor<TCommand>,
    handler: Constructor<THandler>,
) => {
    requestHandler(commandConstructor)(handler);
};

export const registerNotificationHandler = <TNotification extends INotification>(
    notificationConstructor: Constructor<TNotification>,
    handler: Constructor<INotificationHandler<TNotification>>,
) => {
    notificationHandler(notificationConstructor)(handler);
};
export const unregisterCommandHandler = <TResponse, TCommand extends IRequest<TResponse>>(
    commandConstructor: Constructor<TCommand>,
) => {
    media.mediatorSettings.resolver.remove(commandConstructor.name);
};

export const unregisterNotificationHandler = <TNotification extends INotification>(notificationConstructor: Constructor<TNotification>) => {
    media.mediatorSettings.resolver.remove(notificationConstructor.name);
}


type RequestBaseHandler<TResult, TRequest extends RequestBase<TResult>> = (request: TRequest) => Promise<TResult>


@injectable()
export abstract class HandlerBase<TResult, TRequest extends IRequest<TResult>> implements IRequestHandler<TRequest, TResult> {
    public constructor(@inject(ApiClient) protected apiClient: ApiClient, @inject(NavigationService) protected navigationService: NavigationService) {
    }
    abstract handle(request: TRequest): Promise<TResult>;

    protected async handleRequest<Request extends RequestBase<TResult>>(request:Request, handler: RequestBaseHandler<TResult, Request>): Promise<TResult>{
        try {
            request.setBusy?.(true);
            const response = await handler(request);
            request.setState?.(response);
            return response;
        }
        catch (e) {
            console.log(e);
            request.setError?.(e);
        }
        finally {
            request.setBusy?.(false);
        }

    }
}

export abstract class RequestBase<TResult> implements IRequest<TResult> {
    protected constructor(
        public setState?: SetState<TResult> | undefined,
        public setBusy?: SetState<boolean> | undefined,
        public setError?: SetState<Error> | undefined,
    ) {
    }
}