import {IRequest} from "mediatr-ts";
import {Settings} from "./model.ts";

export class GetLocationSettings implements IRequest<Settings>{
    constructor(public locationId: string){}
}


