import {container} from "./ioc";
import {ApiClient} from "@cerberus/shared/src";
import {ApiClientImpl} from "./api/api-client.ts";

export const bootstrapCore = () =>{
    console.log('core bootstrapping');
    container.bind<ApiClient>(ApiClient).to(ApiClientImpl).inSingletonScope();
}

export const teardownCore = () =>{
    console.log('core teardown');
    container.isBound(ApiClient) && container.unbind(ApiClient);
};