import {Container, injectable} from "inversify";
import {NotificationService} from "@uxland/react-services";
import {NotificationServiceImplementation} from "./notification-service.ts";

export * from './component';
export * from './notification-service';

export const useNotificationService = (container: Container) => {
    injectable()(NotificationService)
    container.bind(NotificationService).to(NotificationServiceImplementation).inTransientScope();
    return Promise.resolve(container);
}