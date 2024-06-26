import {HierarchyItem} from "./hierarchy-item.ts";
import {inject} from "inversify";
import {ApiClient} from "@cerberus/shared/src";
export abstract class LoadOrganizationalStructureFacade {
  abstract loadOrganizationalStructure(parentId: string | undefined): Promise<HierarchyItem[]>;
}

export class LoadOrganizationalStructureFacadeImpl implements LoadOrganizationalStructureFacade {
    constructor(@inject("ApiClient") private apiClient: ApiClient) {

    }
  loadOrganizationalStructure(parentId: string): Promise<HierarchyItem[]> {
        return this.apiClient.get<HierarchyItem[]>(`/locations/${parentId || 'root'}/children`);
  }
}