import { Container } from "inversify";
import { useScheduler } from "./schedule/bootstrapper.ts";

export const useOperators = (container: Container) =>
    useScheduler(container)

