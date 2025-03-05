import { Round } from "./domain";
import { IRequest } from 'mediatr-ts';

export class EditOrCreateRound implements IRequest<void> {
    constructor(public id: string | undefined, public round: Round) { }
}

