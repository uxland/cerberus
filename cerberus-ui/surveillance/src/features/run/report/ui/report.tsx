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
        <div className="flex flex-col min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] overflow-hidden">
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
    );
};




// import { Typography } from "@mui/material";
// import { useSurveillanceLocales } from "../../../../locales/ca/locales.ts";
// import { format } from "date-fns";
// import { es } from "date-fns/locale";
// import { Run, InspectionRun } from "../../execution/domain/model.ts";
// import { useState } from "react";

// export const RunReport = ({ run }: { run: Run }) => {
//     const runDetailsTitle = useSurveillanceLocales("run.details.title");
//     const runStartedAt = useSurveillanceLocales("run.details.startedAt");
//     const runInspections = useSurveillanceLocales("run.details.inspections");
//     const runLocation = useSurveillanceLocales("run.details.location");
//     const runStatus = useSurveillanceLocales("run.details.status");
//     const inspectionsCompleted = useSurveillanceLocales("run.details.inspectionsCompleted");
//     const runId = useSurveillanceLocales("run.details.id");
//     const videoTitle = useSurveillanceLocales("run.report.videoTitle");
//     const videoDetails = useSurveillanceLocales("run.report.videoDetails");
//     const cameraLabel = useSurveillanceLocales("run.report.cameraLabel");
//     const durationLabel = useSurveillanceLocales("run.report.durationLabel");
//     const dateLabel = useSurveillanceLocales("run.report.dateLabel");
//     const notAvailable = useSurveillanceLocales("run.report.notAvailable");
//     const videoNotSupported = useSurveillanceLocales("run.report.videoNotSupported");
//     const normalStatus = useSurveillanceLocales("run.anomalyStatuses.normal");
//     const singleAnomalyStatus = useSurveillanceLocales("run.anomalyStatuses.singleAnomaly");
//     const multipleAnomaliesStatus = useSurveillanceLocales("run.anomalyStatuses.multipleAnomalies");

//     const [selectedInspection, setSelectedInspection] = useState<InspectionRun>(run.inspectionRuns?.[0]);
//     const formatDate = (dateStr: string) => {
//         try {
//             const date = new Date(dateStr);
//             return format(date, "dd MMM yyyy, HH:mm:ss", { locale: es });
//         } catch (e) {
//             return dateStr || "";
//         }
//     };
//     const calculateDuration = (startDate: string, endDate: string): string => {
//         try {
//             const start = new Date(startDate);
//             const end = new Date(endDate);

//             const diff = end.getTime() - start.getTime();

//             const minutes = Math.floor(diff / 60000);
//             const seconds = Math.floor((diff % 60000) / 1000);

//             return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//         } catch (e) {
//             return "00:00";
//         }
//     };

//     return (
//         <div className="flex flex-col min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] overflow-hidden">
//             <div className="flex items-center gap-2 bg-tableBg py-3 px-6 rounded-[10px] w-full flex-shrink-0">
//                 <Typography className="uppercase !text-primary !font-semibold">{run.roundId || "N/A"}</Typography>
//                 <Typography className="uppercase">{run.rootLocationId || "N/A"}</Typography>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow mt-4 overflow-hidden">
//                 <div className="flex flex-col bg-tableBg p-6 rounded-[10px]">
//                     <h1 className="text-xl font-bold mb-4">{runDetailsTitle}</h1>
//                     <span className="bg-[#313131] block p-[1px] w-full mb-5"></span>

//                     <div className="grid grid-cols-1 gap-4">
//                         <div className="bg-[#313131] p-4 rounded-lg">
//                             <div className="flex justify-between items-center mb-2">
//                                 <Typography className="text-grey82">{runId}:</Typography>
//                                 <Typography className="font-semibold">{run.id ? run.id.substring(0, 8) : "N/A"}</Typography>
//                             </div>
//                             <div className="flex justify-between items-center mb-2">
//                                 <Typography className="text-grey82">{runLocation}:</Typography>
//                                 <Typography className="font-semibold">{run.rootLocationId || "N/A"}</Typography>
//                             </div>
//                             <div className="flex justify-between items-center mb-2">
//                                 <Typography className="text-grey82">{runStartedAt}:</Typography>
//                                 <Typography className="font-semibold">{run.startedAt ? formatDate(run.startedAt) : "N/A"}</Typography>
//                             </div>
//                             <div className="flex justify-between items-center mb-2">
//                                 <Typography className="text-grey82">{runStatus}:</Typography>
//                                 <Typography className="font-semibold">{run.status || "N/A"}</Typography>
//                             </div>
//                             <div className="flex justify-between items-center">
//                                 <Typography className="text-grey82">{inspectionsCompleted}:</Typography>
//                                 <Typography className="font-semibold">{run.inspectionRuns?.length || 0} / {run.inspectionRuns?.length || 0}</Typography>
//                             </div>
//                         </div>

//                         <div className="mt-2">
//                             <h2 className="text-lg font-bold mb-2">{runInspections}</h2>
//                             <div className="max-h-[400px] overflow-y-auto pr-1">
//                                 {run.inspectionRuns?.map((inspection) => (
//                                     <div
//                                         key={inspection.inspectionId}
//                                         className={`bg-[#313131] p-3 rounded-lg mb-2 flex justify-between items-center relative cursor-pointer ${selectedInspection?.id === inspection.id ? "border border-primary" : ""
//                                             }`}
//                                         onClick={() => setSelectedInspection(inspection)}
//                                     >
//                                         <div>
//                                             <Typography className="font-semibold">{inspection.cameraDescription}</Typography>
//                                             <Typography className="text-sm text-grey82">
//                                                 {formatDate(inspection.startedAt)}
//                                             </Typography>
//                                         </div>
//                                         <span className={`px-2 py-1 rounded-full text-xs ${inspection.operationRun && inspection.operationRun.answers &&
//                                             inspection.operationRun.answers.some(a => a.answer && a.answer.isAnomalous === true)
//                                             ?
//                                             inspection.operationRun.answers.filter(a => a.answer && a.answer.isAnomalous === true).length > 1
//                                                 ? "bg-red-900 text-red-300"
//                                                 : "bg-yellow-900 text-yellow-300"
//                                             : "bg-green-900 text-green-300"
//                                             }`}>
//                                             {inspection.operationRun && inspection.operationRun.answers &&
//                                                 inspection.operationRun.answers.some(a => a.answer && a.answer.isAnomalous === true)
//                                                 ? inspection.operationRun.answers.filter(a => a.answer && a.answer.isAnomalous === true).length > 1
//                                                     ? multipleAnomaliesStatus
//                                                     : singleAnomalyStatus
//                                                 : normalStatus
//                                             }
//                                         </span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="flex flex-col bg-tableBg p-6 rounded-[10px]">
//                     <div className="flex-shrink-0">
//                         <h1 className="text-xl font-bold mb-4">{videoTitle}</h1>
//                         <span className="bg-[#313131] block p-[1px] w-full mb-5"></span>
//                     </div>

//                     <div className="flex-grow flex flex-col">
//                         <div className="relative w-full h-0 pb-[56.25%] bg-[#1a1a1a] rounded-lg mb-4">
//                             <video
//                                 className="absolute top-0 left-0 w-full h-full object-contain rounded-lg"
//                                 controls
//                                 poster={selectedInspection?.cameraStreamingUrl}
//                             >
//                                 <source src="/assets/sample-video.mp4" type="video/mp4" />
//                                 {videoNotSupported}
//                             </video>
//                         </div>

//                         <div className="bg-[#313131] p-4 rounded-lg space-y-3">
//                             <Typography className="font-semibold text-lg text-primary border-b border-[#414141] pb-2">
//                                 {videoDetails}
//                             </Typography>
//                             <div className="flex justify-between items-center">
//                                 <Typography className="text-grey82 font-medium">{cameraLabel}:</Typography>
//                                 <Typography className="font-semibold">
//                                     {selectedInspection ? selectedInspection.cameraDescription : notAvailable}
//                                 </Typography>
//                             </div>
//                             <div className="flex justify-between items-center">
//                                 <Typography className="text-grey82 font-medium">{durationLabel}:</Typography>
//                                 <Typography className="font-semibold">
//                                     {selectedInspection && selectedInspection.startedAt && selectedInspection.endedAt
//                                         ? calculateDuration(selectedInspection.startedAt, selectedInspection.endedAt)
//                                         : "00:00"}
//                                 </Typography>
//                             </div>
//                             <div className="flex justify-between items-center">
//                                 <Typography className="text-grey82 font-medium">{dateLabel}:</Typography>
//                                 <Typography className="font-semibold">
//                                     {selectedInspection && selectedInspection.startedAt
//                                         ? formatDate(selectedInspection.startedAt)
//                                         : notAvailable}
//                                 </Typography>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }