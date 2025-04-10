import {HandlerBase} from "@cerberus/core";
import {ListLocationSubHierarchy} from "./query.ts";
import {LocationHierarchicalItem} from "./model.ts";

export class Handler extends HandlerBase<LocationHierarchicalItem[], ListLocationSubHierarchy> {
    handle(request: ListLocationSubHierarchy): Promise<LocationHierarchicalItem[]> {
        return this.handleRequest(request, this.fetchLocationSubHierarchy.bind(this));
    }

    private fetchLocationSubHierarchy({locationId}: ListLocationSubHierarchy): Promise<LocationHierarchicalItem[]> {
        return this.apiClient.get(`organizational-structure/hierarchy-items/${locationId}/descendants`);
    }
}