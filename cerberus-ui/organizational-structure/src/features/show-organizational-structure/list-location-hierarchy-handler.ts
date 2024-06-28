import {IRequestHandler} from "mediatr-ts";
import {HierarchyItem} from "./hierarchy-item.ts";
import {ListLocationHierarchy} from "./list-location-children.ts";
import {LoadOrganizationalStructureFacade} from "./facade.ts";
import {inject} from "inversify";

export class ListLocationHierarchyHandler implements IRequestHandler<ListLocationHierarchy, HierarchyItem[]> {
    constructor(@inject(LoadOrganizationalStructureFacade) private facade: LoadOrganizationalStructureFacade) {
    }

    handle(_: ListLocationHierarchy): Promise<HierarchyItem[]> {
        return this.facade.loadOrganizationalStructure();
    }
}