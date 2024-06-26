import {container } from '@cerberus/core';
import {IResolver, mediatorSettings} from "mediatr-ts";

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
//setMediatorResolver(iocContainer).then(() => {});