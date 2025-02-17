import {registerCommandHandler} from "@cerberus/core";
import {ListOperations} from "./query.ts";
import {ListOperationsHandler} from "./handler.ts";

export const useListOperations = (container) =>{
    registerCommandHandler(ListOperations, ListOperationsHandler);
    return Promise.resolve(container);
}