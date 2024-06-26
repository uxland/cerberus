import {IRequest} from "mediatr-ts";
import {HierarchyItem} from "./hierarchy-item.ts";

export class ListLocationChildren implements IRequest<HierarchyItem[]> {
    constructor(public parentId: string | undefined) {
    }
}


