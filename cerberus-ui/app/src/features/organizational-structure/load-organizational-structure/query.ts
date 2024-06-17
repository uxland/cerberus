import {IRequest} from 'mediatr-ts';

export class ListStructureItems implements IRequest<any> {
    constructor(public parentId: string | undefined) {
    }
}