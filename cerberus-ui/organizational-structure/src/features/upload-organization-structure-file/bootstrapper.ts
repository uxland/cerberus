import {Container} from "inversify";
import {UploadOrganizationalStructureFileFacade, UploadOrganizationalStructureFileFacadeImpl} from "./facade.ts";
import {requestHandler} from "mediatr-ts";
import {UploadOrganizationStructureFileHandler} from "./handler.ts";
import {UploadOrganizationStructureFile} from "./command.ts";
import {addRoute, store, registerRouteComponent} from "@cerberus/core";
import {OrganizationalStructureFileUploader} from "./component.tsx";

export const bootstrapUploadOrganizationStructureFile = (container: Container): Promise<Container> => {
    container.bind(UploadOrganizationalStructureFileFacade).to(UploadOrganizationalStructureFileFacadeImpl).inTransientScope();
    requestHandler(UploadOrganizationStructureFile)(UploadOrganizationStructureFileHandler);
    registerRouteComponent(OrganizationalStructureFileUploader.name, OrganizationalStructureFileUploader);
    store.dispatch(addRoute({path: '/', componentName: OrganizationalStructureFileUploader.name, exact: true, name: 'Upload Organizational Structure File'}));
    return Promise.resolve(container);
};