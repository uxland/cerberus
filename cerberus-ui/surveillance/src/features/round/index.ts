import { Container } from "inversify";
import { useListRounds } from "./list/bootsrapper.ts";
import { useCreateRound } from "./create/bootstrapper.ts";
import { useDeleteRound } from "./delete/bootstrapper.ts";

export const useRound = (container: Container) =>
    useListRounds(container)
        .then(useCreateRound).then(useDeleteRound);

export * from './list';
export * from './create';
