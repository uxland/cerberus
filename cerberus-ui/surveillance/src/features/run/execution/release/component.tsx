import { ExecutionStepArgs } from "../model.ts";
import { Typography } from "@mui/material";
import { useSurveillanceLocales } from "../../../../locales/ca/locales.ts";
import { RunDetailsCard } from "../../report/ui/runDetailsCard";
import { RunInspectionsList } from "../../report/ui/runInspectionsList";

import { sendMediatorRequest } from "@cerberus/core";
import { ReleaseRun } from "./command.ts";
import {ReleaseActions} from "./components/releaseActions.tsx";

export default function ReleaseSurveillanceRun({ run, handler }: ExecutionStepArgs) {
    const title = useSurveillanceLocales("run.release.title");
    const additionalComments = useSurveillanceLocales("run.release.additionalComments");
    const confirmButtonText = useSurveillanceLocales("run.release.confirm");
    const cancelButtonText = useSurveillanceLocales("run.release.cancel");
    const runDetailsTitle = useSurveillanceLocales("run.details.title");
    const runInspections = useSurveillanceLocales("run.details.inspections");
    const commentsPlaceholder = useSurveillanceLocales("run.release.commentsPlaceholder");
    const normalStatus = useSurveillanceLocales("run.anomalyStatuses.normal");
    const singleAnomalyStatus = useSurveillanceLocales("run.anomalyStatuses.singleAnomaly");
    const multipleAnomaliesStatus = useSurveillanceLocales("run.anomalyStatuses.multipleAnomalies");
    const notApplicable = useSurveillanceLocales("run.common.notApplicable");

    const handleConfirm = (comments) => {
        sendMediatorRequest({ command: new ReleaseRun(run.id, comments) });
    };
    const handleCancel = () => { };

    return (
        // <div className="flex flex-col gap-2 bg-tableBg py-3 px-6 rounded-[10px] w-full flex-shrink-0 space-y-4">
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-2 bg-tableBg py-3 px-6 rounded-[10px] w-full flex-shrink-0">
                <Typography className="uppercase !text-primary !font-semibold">{run.roundId || notApplicable}</Typography>
                <Typography className="uppercase">{run.rootLocationId || notApplicable}</Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow mt-4 overflow-hidden">
                <div className="flex flex-col bg-tableBg p-6 rounded-[10px]">
                    <h1 className="text-xl font-bold mb-4">{runDetailsTitle}</h1>
                    <span className="bg-[#313131] block p-[1px] w-full mb-5"></span>

                    <RunDetailsCard run={run} />

                    <RunInspectionsList
                        inspections={run.inspectionRuns || []}
                        selectedInspectionId={null}
                        onSelectInspection={() => { }}
                        singleAnomalyStatus={singleAnomalyStatus}
                        multipleAnomaliesStatus={multipleAnomaliesStatus}
                        normalStatus={normalStatus}
                        runInspectionsTitle={runInspections}
                    />
                </div>

                <ReleaseActions
                    runId={run.id}
                    title={title}
                    additionalComments={additionalComments}
                    confirmButtonText={confirmButtonText}
                    cancelButtonText={cancelButtonText}
                    commentsPlaceholder={commentsPlaceholder}
                    onCancel={handleCancel}
                    onConfirm={handleConfirm}
                />
            </div>
        </div>
        // </div>
    );
}