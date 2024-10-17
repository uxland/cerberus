import {Container} from "inversify";
import {UserAuthenticated, UserLoggedOut} from "./notifications.ts";
import {SetUserOnUserAuthenticatedHandler, ResetUserOnUserLoggedOutHandler} from "./handlers.ts";
import {registerNotificationHandler, unregisterNotificationHandler} from "../mediator";

export * from './keycloak.ts'

const notificationHandlers = [
    {notification: UserAuthenticated, handler: SetUserOnUserAuthenticatedHandler},
    {notification: UserLoggedOut, handler: ResetUserOnUserLoggedOutHandler},
]

export const bootstrapAuth = async(container: Container) => {
    teardownAuth(container);
    for (const {notification, handler} of notificationHandlers) {
        registerNotificationHandler(notification, handler);
    }
    return container;
}

export const teardownAuth = async(container: Container) => {
    for (const {notification} of notificationHandlers) {
        unregisterNotificationHandler(notification);
    }
    return container;
}