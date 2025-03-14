
import { Run, InspectionRun } from "../../domain/model.ts";
export const getCurrentInspection: (run: Run) => InspectionRun | undefined = (run) => run.inspectionRuns.find(ir => ir.inspectionId === run.currentInspectionRunId);