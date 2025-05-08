import { useState } from "react";
import { Typography } from "@mui/material";
import { Run } from "../../execution/domain/model";
import { useSurveillanceLocales } from "../../../../locales/ca/locales.ts";
import { RunDetailsCard } from "./runDetailsCard";
import { RunInspectionsList } from "./runInspectionsList";
import { RunVideoSection } from "./runVideoSection";

export const RunReport = ({ run }: { run: Run }) => {
    const runDetailsTitle = useSurveillanceLocales("run.details.title");
    const runInspectionsTitle = useSurveillanceLocales("run.details.inspections");
    const videoTitle = useSurveillanceLocales("run.report.videoTitle");
    const videoNotSupported = useSurveillanceLocales("run.report.videoNotSupported");
    const cameraLabel = useSurveillanceLocales("run.report.cameraLabel");
    const durationLabel = useSurveillanceLocales("run.report.durationLabel");
    const dateLabel = useSurveillanceLocales("run.report.dateLabel");
    const notAvailable = useSurveillanceLocales("run.report.notAvailable");
    const normalStatus = useSurveillanceLocales("run.anomalyStatuses.normal");
    const singleAnomalyStatus = useSurveillanceLocales("run.anomalyStatuses.singleAnomaly");
    const multipleAnomaliesStatus = useSurveillanceLocales("run.anomalyStatuses.multipleAnomalies");

    const [selectedInspection, setSelectedInspection] = useState(run.inspectionRuns?.[0]);

    return (
        // <div className="flex flex-col gap-2 bg-tableBg py-3 px-6 rounded-[10px] w-full flex-shrink-0 space-y-4">
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-2 bg-tableBg py-3 px-6 rounded-[10px] w-full flex-shrink-0">
                <Typography className="uppercase !text-primary !font-semibold">{run.roundId || "N/A"}</Typography>
                <Typography className="uppercase">{run.rootLocationId || "N/A"}</Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow mt-4 overflow-hidden">
                <div className="flex flex-col bg-tableBg p-6 rounded-[10px]">
                    <h1 className="text-xl font-bold mb-4">{runDetailsTitle}</h1>
                    <span className="bg-[#313131] block p-[1px] w-full mb-5"></span>

                    <RunDetailsCard run={run} />

                    <RunInspectionsList
                        inspections={run.inspectionRuns || []}
                        selectedInspectionId={selectedInspection?.id}
                        onSelectInspection={setSelectedInspection}
                        singleAnomalyStatus={singleAnomalyStatus}
                        multipleAnomaliesStatus={multipleAnomaliesStatus}
                        normalStatus={normalStatus}
                        runInspectionsTitle={runInspectionsTitle}
                    />
                </div>

                <RunVideoSection
                    videoTitle={videoTitle}
                    selectedInspection={selectedInspection}
                    videoNotSupported={videoNotSupported}
                    cameraLabel={cameraLabel}
                    durationLabel={durationLabel}
                    dateLabel={dateLabel}
                    notAvailable={notAvailable}
                />
            </div>
        </div>
        // </div>
    );
};
