import {User} from "@cerberus/shared/src/domain/user.ts";
import {INotification} from "mediatr-ts";

export class UserAuthenticated implements INotification {
  constructor(public user: User) {}
}

export class UserLoggedOut implements INotification {
}