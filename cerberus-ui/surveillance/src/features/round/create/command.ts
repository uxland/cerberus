import { IRequest } from "mediatr-ts";

export interface OperationQuestion {
    id?: string;
    title: string;
    responseType: string;
    responseSubtype: string;
    required: boolean;
    options?: string[];
}

export class CreateOperation implements IRequest<void> {
    id?: string;
    name: string;
    questions: OperationQuestion[];

    constructor(name: string, questions: OperationQuestion[], id?: string) {
        this.id = id;
        this.name = name;
        this.questions = questions;
    }
}