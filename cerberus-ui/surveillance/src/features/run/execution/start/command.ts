import { IRequest } from "mediatr-ts";
import { Run } from "../domain/model.ts";

export class StartRun implements IRequest<Run> {
    constructor(public id: string) { }
}

