import {container } from '@cerberus/core';
import {IResolver, Mediator, mediatorSettings} from "mediatr-ts";
import {bootstrapNavigation} from "./navigation/set-navigation.ts";

class InversifyResolver implements IResolver {
    add(name: string, instance: Function): void {
        container.bind(name).to(instance as any);
    }

    clear(): void {
        throw new Error("Method not implemented");
    }

    remove(name: string): void {
        container.isBound(name) && container.unbind(name);
    }

    resolve<T>(name: string): T {
        return container.get<T>(name);
    }
}
mediatorSettings.resolver = new InversifyResolver();
const mediator = new Mediator();
container.bind(Mediator).toConstantValue(mediator);
bootstrapNavigation();
//setMediatorResolver(iocContainer).then(() => {});