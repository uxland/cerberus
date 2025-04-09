import { Container } from "inversify";
import { useCreateRun } from "./create/bootstrapper.ts";
import { useExecuteRun } from "./execution/bootstrapper.ts";
import { useReportRun } from "./report/bootstrapper.ts";
import { useRunList } from "./list/bootstrapper.ts";
import { useAcquireRun } from "./acquire/bootstrapper.ts";

export const useRun = (container: Container) =>
    useCreateRun(container).then(useExecuteRun).then(useReportRun).then(useRunList).then(useAcquireRun);

