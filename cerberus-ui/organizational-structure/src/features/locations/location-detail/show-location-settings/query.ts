import {IRequest} from "mediatr-ts";
import {LocationSettings} from "./model.ts";
import {HierarchyItemType} from "../../../state/hierarchy-item.ts";

export class GetLocationSettings implements IRequest<LocationSettings>{
    constructor(public locationId: string, public itemType: HierarchyItemType){}
}


