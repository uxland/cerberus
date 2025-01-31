import {ApiClient} from "@cerberus/shared/src";
import {ApiClientImpl} from "./api/api-client.ts";
import {Container, injectable} from "inversify";
import {container} from "./ioc";
import {NavigationService} from "./routing";
import {navigationService} from "./routing/navigation-service.ts";
import {bootstrapAuth, teardownAuth} from "./auth";
import {useUserInteraction} from "./user-interaction/bootstrapper.ts";
export const bootstrapCore = () =>{
    console.log('core bootstrapping');
    injectable()(ApiClient);
    injectable()(ApiClientImpl);
    container.bind<ApiClient>(ApiClient).to(ApiClientImpl).inSingletonScope();
    container.bind<Container>(Container).toConstantValue(container);
    container.bind<NavigationService>(NavigationService).toConstantValue(navigationService);
    return bootstrapAuth(container)
        .then(useUserInteraction);
}

export const teardownCore = async () =>{
    console.log('core teardown');
    container.isBound(ApiClient) && container.unbind(ApiClient);
    await teardownAuth(container);
};

