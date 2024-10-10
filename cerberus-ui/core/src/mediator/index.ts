import * as media from "mediatr-ts";
import {
    INotification,
    INotificationHandler,
    IRequest,
    IRequestHandler,
    notificationHandler,
    requestHandler,
} from "mediatr-ts";

interface Constructor<T> {
    new (...args: any[]): T;
}
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
