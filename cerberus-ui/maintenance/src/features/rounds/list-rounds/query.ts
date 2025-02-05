import { IRequest } from 'mediatr-ts';
import { RoundSummary } from "./model";

export class ListRounds implements IRequest<RoundSummary[]> {
    constructor(public id: string) { }
}