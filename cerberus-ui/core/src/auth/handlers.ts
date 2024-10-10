import {INotificationHandler} from "mediatr-ts";
import {UserAuthenticated, UserLoggedOut} from "./notifications.ts";
import {store} from "../state";
import {resetUser, setUser} from "./state.ts";
import {injectable} from "inversify";
import "../ioc";

@injectable()
export class SetUserOnUserAuthenticatedHandler implements INotificationHandler<UserAuthenticated> {
    handle(notification: UserAuthenticated): Promise<void> {
        store.dispatch(setUser(notification.user));
        return Promise.resolve();
    }
}
@injectable()
export class ResetUserOnUserLoggedOutHandler implements INotificationHandler<UserLoggedOut> {
    handle(_: UserLoggedOut): Promise<void> {
        store.dispatch(resetUser());
        return Promise.resolve();
    }

}