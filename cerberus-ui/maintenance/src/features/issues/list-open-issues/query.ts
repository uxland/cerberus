import {IRequest} from 'mediatr-ts';
import {MaintenanceIssueSummary} from "./model.ts";

export class ListOpenIssues implements IRequest<MaintenanceIssueSummary[]>{
    constructor(public id: string) {  }
}

