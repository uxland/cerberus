import {IRequest} from "mediatr-ts";

export class UploadOrganizationStructureFile implements IRequest<void> {
    constructor(public file: File) {
    }
}