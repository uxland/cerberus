import {inject, injectable} from "inversify";
import {IRequestHandler} from "mediatr-ts";
import {GetLocationSettings} from "./query.ts";
import { GetLocationSettingsFacade } from "./facade.ts";
import {LocationSettings} from "./model.ts";

@injectable()
export class Handler implements IRequestHandler<GetLocationSettings, LocationSettings> {
    constructor(@inject(GetLocationSettingsFacade) private facade: GetLocationSettingsFacade) {
    }

    handle(query: GetLocationSettings): Promise<LocationSettings> {
        return this.facade.getSettings(query.locationId, query.itemType);
    }
}