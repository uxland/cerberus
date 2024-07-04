import {Container} from "inversify";
import {requestHandler} from "mediatr-ts";
import {Handler} from "./handler.ts";
import {GetLocationSettings} from "./query.ts";
import {GetLocationSettingsFacade, GetLocationSettingsImpl} from "./facade.ts";

export const bootstrapShowLocationSettings = (container: Container) => {
    requestHandler(GetLocationSettings)( Handler);
    container.bind(GetLocationSettingsFacade).to(GetLocationSettingsImpl).inTransientScope();
    return Promise.resolve(container);
}