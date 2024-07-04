import {inject, injectable} from "inversify";
import {ApiClient} from "@cerberus/shared/src";
import {LocationSettings} from "./model.ts";
import {HierarchyItemType} from "../../../show-organizational-structure/hierarchy-item.ts";

@injectable()
export abstract class GetLocationSettingsFacade {
    abstract getSettings(locationId: string, type: HierarchyItemType): Promise<LocationSettings>;
}

@injectable()
export class GetLocationSettingsImpl extends GetLocationSettingsFacade {
    constructor(@inject(ApiClient) private apiClient: ApiClient) {
        super();
    }
    getSettings(locationId: string, type: HierarchyItemType): Promise<LocationSettings> {
        const url = type === HierarchyItemType.location ? `/locations/${locationId}` : `/cameras/${locationId}`;
        return this.apiClient.get<LocationSettings>(url);
    }
}