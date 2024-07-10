import {UploadOrganizationStructureFile} from "./command.ts";
import {IRequestHandler, Mediator} from "mediatr-ts";
import {inject, injectable} from "inversify";
import {UploadOrganizationalStructureFileFacade} from "./facade.ts";
import {OrganizationStructureChanged} from "../state/notification.ts";

@injectable()
export class UploadOrganizationStructureFileHandler implements IRequestHandler<UploadOrganizationStructureFile, void> {
    constructor(@inject(UploadOrganizationalStructureFileFacade) private facade: UploadOrganizationalStructureFileFacade) {
    }

    async handle(command: UploadOrganizationStructureFile): Promise<void> {
        await this.facade.upload(command.file);
        await new Mediator().publish(new OrganizationStructureChanged());
    }

}