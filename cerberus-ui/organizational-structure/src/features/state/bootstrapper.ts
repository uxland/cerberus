import {Container} from "inversify";
import {Mediator, notificationHandler, requestHandler} from "mediatr-ts";
import {OrganizationStructureChanged, Handler} from "./notification.ts";
import {injectReducer, nop} from "@cerberus/core";
import {locationHierarchySlice} from "./reducer.ts";
import {ListLocationHierarchy, ListLocationHierarchyHandler} from "./query.ts";

export const bootstrapOrganizationStructureState = (container: Container) => {
    injectReducer('locationHierarchy', locationHierarchySlice.reducer);
    notificationHandler(OrganizationStructureChanged)(Handler);
    requestHandler(ListLocationHierarchy)(ListLocationHierarchyHandler);
    container.get(Mediator).send(new ListLocationHierarchy()).then(nop);
    return Promise.resolve(container);
};