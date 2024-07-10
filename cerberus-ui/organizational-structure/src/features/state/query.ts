import {IRequest, IRequestHandler} from "mediatr-ts";
import {buildLocationsTree, HierarchyItem, LocationNode} from "./hierarchy-item.ts";
import {inject, injectable} from "inversify";
import {ApiClient} from "@cerberus/shared/src";
import {store} from "@cerberus/core";
import {setLocationHierarchy} from "./reducer.ts";

export class ListLocationHierarchy implements IRequest<LocationNode[]> {
}

@injectable()
export class ListLocationHierarchyHandler implements IRequestHandler<ListLocationHierarchy, LocationNode[]> {
    constructor(@inject(ApiClient) private apiClient: ApiClient) {

    }

    async handle(_: ListLocationHierarchy): Promise<LocationNode[]> {
        const items = await this.apiClient.get<HierarchyItem[]>('/locations');
        const locationHierarchy = buildLocationsTree(items, undefined);
        store.dispatch(setLocationHierarchy(locationHierarchy));
        return locationHierarchy;
    }
}