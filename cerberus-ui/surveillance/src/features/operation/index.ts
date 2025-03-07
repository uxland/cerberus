import { Container } from "inversify";
import { useListOperations } from "./list-operations/bootsrapper.ts";
import { useCreateOperation } from "./create/bootstrapper.ts";
import { useDeleteOperation } from "./delete/bootstrapper.ts";

export const useOperation = (container: Container) =>
    useListOperations(container)
        .then(useCreateOperation).then(useDeleteOperation);

export * from './list-operations';
export * from './create';
