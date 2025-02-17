import { Container } from "inversify";
import { useListOperations } from "./list-operations/bootsrapper.ts";
import { useCreateOperation } from "./create/bootstrapper.ts";

export const useOperation = (container: Container) =>
    useListOperations(container)
        .then(useCreateOperation);

export * from './list-operations';
export * from './create';
