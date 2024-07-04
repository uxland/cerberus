import {HierarchyItem, LocationNode} from "./hierarchy-item.ts";
import {inject} from "inversify";
import {ApiClient} from "@cerberus/shared/src";
export abstract class LoadOrganizationalStructureFacade {
  abstract loadOrganizationalStructure(): Promise<HierarchyItem[]>;
}

export class LoadOrganizationalStructureFacadeImpl implements LoadOrganizationalStructureFacade {
    constructor(@inject(ApiClient) private apiClient: ApiClient) {

    }
  async loadOrganizationalStructure(): Promise<LocationNode[]> {
    const items = await this.apiClient.get<HierarchyItem[]>('/locations');
    return buildLocationsTree(items, undefined);
  }
}

const buildLocationsTree = (items: HierarchyItem[], parentId = "", visited: Set<string> = new Set()): LocationNode[] => {
    const children = items.filter((item) => (item.parentId || "") === parentId);
    return children.map((child) => {
        if (visited.has(child.id)) {
            throw new Error(`Circular reference detected: ${child.id}`);
        }
        visited.add(child.id);
        return {
            ...child,
            children: buildLocationsTree(items, child.id, visited),
        };
    });
}