import {inject, injectable} from "inversify";
import {IRequestHandler} from "mediatr-ts";
import {Settings} from "./model.ts";
import {GetLocationSettings} from "./query.ts";
import { GetLocationSettingsFacade } from "./facade.ts";

@injectable()
export class Handler implements IRequestHandler<GetLocationSettings, Settings> {
    constructor(@inject(GetLocationSettingsFacade) private facade: GetLocationSettingsFacade) {
    }

    handle(query: GetLocationSettings): Promise<Settings> {
        return this.facade.getSettings(query.locationId);
    }
}