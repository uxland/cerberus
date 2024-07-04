import {Container, injectable} from "inversify";
import {LoadOrganizationalStructureFacade, LoadOrganizationalStructureFacadeImpl} from "./facade.ts";
import {requestHandler} from "mediatr-ts";
import {ListLocationHierarchyHandler} from "./list-location-hierarchy-handler.ts";
import {ListLocationHierarchy} from "./list-location-children.ts";

export const bootstrapShowOrganizationStructure = (container: Container): Promise<Container> =>{
    injectable()(LoadOrganizationalStructureFacadeImpl);
    injectable()(ListLocationHierarchyHandler);
    container.bind<LoadOrganizationalStructureFacade>(LoadOrganizationalStructureFacade).to(LoadOrganizationalStructureFacadeImpl).inTransientScope();

    requestHandler(ListLocationHierarchy)(ListLocationHierarchyHandler);
    return Promise.resolve(container);
};