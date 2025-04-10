import {nop, registerCommandHandler} from "@cerberus/core";
import { Container } from "inversify";
import { AcquireRun } from "./command";
import {AcquireRunHandler} from "./handler";
import {PubSubSubService} from "@cerberus/core/src/pubsub";
import {Mediator} from "mediatr-ts";

export const useAcquireRun = (container: Container) => {
    registerCommandHandler(AcquireRun, AcquireRunHandler);
    subscribeToRunNotifications(container);
    return Promise.resolve(container);
}

const subscribeToRunNotifications = (container: Container) => {
    const pubSub = container.get(PubSubSubService);
    pubSub.subscribe("surveillance:run:created", data =>{
        const cmd = new AcquireRun(data.id, data.description, data.rounId);
        new Mediator().send(cmd).then(nop)
    })
}