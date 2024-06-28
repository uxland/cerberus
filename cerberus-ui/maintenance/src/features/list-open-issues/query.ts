import {IRequest} from 'mediatr-ts';
import {MaintenanceIssue} from "./model.ts";

export class ListOpenIssues implements IRequest<MaintenanceIssue[]>{
    constructor(public path: string) {  }
}

