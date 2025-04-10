import {Container, injectable} from "inversify";

import * as signalR from "@microsoft/signalr";
import {keycloak} from "../auth";
import {INotificationHandler, notificationHandler} from "mediatr-ts";
import {UserAuthenticated} from "../auth/notifications.ts";
// @ts-ignore
const urlBase = import.meta.env.VITE_CERBERUS_BACKEND_URL

export type NotificationHandler = <T>(message: T) => void;

@injectable()
export abstract class PubSubSubService {
    abstract subscribe(topic: string, notificationHandler: NotificationHandler): void;
}

class PubSubSubServiceImpl extends PubSubSubService{
    private handlers: Map<string, NotificationHandler[]> = new Map<string, NotificationHandler[]>();
    private connection: signalR.HubConnection | undefined;

    public init(connection: signalR.HubConnection) {
        this.connection = connection;
        connection.on("surveillance:run:created", (message   )=>{
            console.log("Received message for surveillance:run:created:", message);
        })
        const topics = Array.from(this.handlers.keys());
        topics.forEach(topic => this.subscribeToTopicInner(topic));

    }

    subscribe(topic: string, notificationHandler: NotificationHandler): void {
        if(!this.handlers.has(topic)) {
            this.handlers.set(topic, []);
        }

        this.handlers.get(topic).push(notificationHandler);
    }

    private subscribeToTopic(topic: string): void {
        if(this.connection)
            this.subscribeToTopicInner(topic);
    }
    private subscribeToTopicInner(topic: string): void {
        this.connection.on(topic, (message: any) => {
            const handlers = this.handlers.get(topic) || [];
            handlers.forEach(handler => handler(message));
        });
    }
}

const pusSub = new PubSubSubServiceImpl();

@injectable()
@notificationHandler(UserAuthenticated)
class ConnectionSetupHandler implements INotificationHandler<UserAuthenticated>{
    async handle(_: UserAuthenticated): Promise<void> {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${urlBase}/cerberus-hub`,{
                accessTokenFactory: () => keycloak.token,
            })
            .withAutomaticReconnect()
            .build()
        await connection.start();
       pusSub.init(connection);
    }
}


export const usePubSubSubService = (container: Container) => {
    container.bind(PubSubSubService).toConstantValue(pusSub);
    return Promise.resolve(container);
}