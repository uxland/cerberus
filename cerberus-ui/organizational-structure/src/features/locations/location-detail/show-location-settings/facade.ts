import {Settings} from "./model.ts";
import {inject, injectable} from "inversify";
import {ApiClient} from "@cerberus/shared/src";

@injectable()
export abstract class GetLocationSettingsFacade {
    abstract getSettings(locationId: string): Promise<Settings>;
}

@injectable()
export class GetLocationSettingsImpl extends GetLocationSettingsFacade {
    constructor(@inject(ApiClient) private apiClient: ApiClient) {
        super();
    }
    getSettings(locationId: string): Promise<Settings> {
        return this.apiClient.get<Settings>(`/locations/${locationId}/settings`);
    }
}