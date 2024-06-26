import {ApiClient} from "@cerberus/shared/src";
import {ApiClientImpl} from "./api/api-client.ts";
import {Container, injectable} from "inversify";
import {container} from "./ioc";
export const bootstrapCore = async () =>{
    console.log('core bootstrapping');
    injectable()(ApiClient);
    injectable()(ApiClientImpl);
    container.bind<ApiClient>(ApiClient).to(ApiClientImpl).inSingletonScope();
    container.bind<Container>(Container).toConstantValue(container);
    return container;
}

export const teardownCore = () =>{
    console.log('core teardown');
    container.isBound(ApiClient) && container.unbind(ApiClient);
};