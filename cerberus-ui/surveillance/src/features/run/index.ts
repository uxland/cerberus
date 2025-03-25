import { Container } from "inversify";
import { useCreateRun } from "./create/bootstrapper.ts";
import { useExecuteRun } from "./execution/bootstrapper.ts";
import { useReportRun } from "./report/bootstrapper.ts";

export const useRun = (container: Container) =>
    useCreateRun(container).then(useExecuteRun).then(useReportRun);

