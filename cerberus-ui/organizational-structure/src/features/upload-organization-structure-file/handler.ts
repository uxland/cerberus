import {UploadOrganizationStructureFile} from "./command.ts";
import {IRequestHandler} from "mediatr-ts";
import {inject, injectable} from "inversify";
import {UploadOrganizationalStructureFileFacade} from "./facade.ts";

@injectable()
export class UploadOrganizationStructureFileHandler implements IRequestHandler<UploadOrganizationStructureFile, void> {
    constructor(@inject(UploadOrganizationalStructureFileFacade) private facade: UploadOrganizationalStructureFileFacade) {
    }

    async handle(command: UploadOrganizationStructureFile): Promise<void> {
        await this.facade.upload(command.file);
        //ToDO: force reload of the organizational structure
    }

}