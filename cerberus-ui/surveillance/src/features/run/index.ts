import { Container } from "inversify";
import { useCreateRun } from "./create/bootstrapper.ts";

export const useRun = (container: Container) =>
    useCreateRun(container);

export * from './create';
