import { Container } from "inversify";
import { useListRounds } from "./list/bootsrapper.ts";
import { useCreateRound } from "./create/bootstrapper.ts";

export const useRound = (container: Container) =>
    useListRounds(container)
        .then(useCreateRound);

export * from './list';
export * from './create';
