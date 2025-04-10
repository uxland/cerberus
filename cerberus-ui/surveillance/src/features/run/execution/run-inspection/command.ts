import { IRequest } from "mediatr-ts";
import { Run } from '../domain/model.ts';
import { InspectionRunData } from "./domain/model.ts";

export class SetRunInspection implements IRequest<Run> {
    constructor(public data: InspectionRunData) {
    }
}