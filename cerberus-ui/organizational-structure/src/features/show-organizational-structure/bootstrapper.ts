import {Container, injectable} from "inversify";
import {LoadOrganizationalStructureFacade, LoadOrganizationalStructureFacadeImpl} from "./facade.ts";
import {mediatorSettings, requestHandler} from "mediatr-ts";
import {ListLocationChildren} from "./list-location-children.ts";
import {ListLocationChildrenHandler} from "./list-location-children-handler.ts";

export const bootstrapShowOrganizationStructure = (container: Container) =>{
    injectable()(LoadOrganizationalStructureFacadeImpl);
    injectable()(ListLocationChildrenHandler);
    container.bind<LoadOrganizationalStructureFacade>(LoadOrganizationalStructureFacade).to(LoadOrganizationalStructureFacadeImpl).inTransientScope();

    requestHandler(ListLocationChildren)(ListLocationChildrenHandler);

    const a =  mediatorSettings.resolver.resolve(ListLocationChildren.name)
    console.log(a.toString())
};