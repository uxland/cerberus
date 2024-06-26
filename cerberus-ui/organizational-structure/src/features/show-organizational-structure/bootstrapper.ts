import {Container} from "inversify";
import {LoadOrganizationalStructureFacade, LoadOrganizationalStructureFacadeImpl} from "./facade.ts";
import {requestHandler} from "mediatr-ts";
import {ListLocationChildren} from "./list-location-children.ts";
import {ListLocationChildrenHandler} from "./list-location-children-handler.ts";

export const bootstrapShowOrganizationStructure = (container: Container) =>{
    container.bind<LoadOrganizationalStructureFacade>(LoadOrganizationalStructureFacade).to(LoadOrganizationalStructureFacadeImpl).inRequestScope();
    requestHandler(ListLocationChildren)(ListLocationChildrenHandler);
};