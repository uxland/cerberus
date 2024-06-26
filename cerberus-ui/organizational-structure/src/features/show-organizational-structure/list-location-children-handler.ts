import {IRequestHandler} from "mediatr-ts";
import {HierarchyItem} from "./hierarchy-item.ts";
import {ListLocationChildren} from "./list-location-children.ts";
import {LoadOrganizationalStructureFacade} from "./facade.ts";
import {inject} from "inversify";

export class ListLocationChildrenHandler implements IRequestHandler<ListLocationChildren, HierarchyItem[]> {
    constructor(@inject(LoadOrganizationalStructureFacade) private facade: LoadOrganizationalStructureFacade) {
    }

    handle(value: ListLocationChildren): Promise<HierarchyItem[]> {
        return this.facade.loadOrganizationalStructure(value.parentId);
    }
}