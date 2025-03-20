import { ExecutionStepArgs } from "../model.ts";
import { Typography } from "@mui/material";
import { useSurveillanceLocales } from "../../../../locales/ca/locales.ts";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { sendMediatorRequest } from "@cerberus/core";
import { ReleaseRun } from "./command.ts";
import { useState } from "react";

export default function ReleaseSurveillanceRun({ run, handler }: ExecutionStepArgs) {
    const title = useSurveillanceLocales("run.release.title");
    const additionalComments = useSurveillanceLocales("run.release.additionalComments");
    const confirmButtonText = useSurveillanceLocales("run.release.confirm");
    const cancelButtonText = useSurveillanceLocales("run.release.cancel");
    const runDetailsTitle = useSurveillanceLocales("run.details.title");
    const runStartedAt = useSurveillanceLocales("run.details.startedAt");
    const runInspections = useSurveillanceLocales("run.details.inspections");
    const runLocation = useSurveillanceLocales("run.details.location");
    const runStatus = useSurveillanceLocales("run.details.status");
    const inspectionsCompleted = useSurveillanceLocales("run.details.inspectionsCompleted");

    const completedInspections = run.inspectionRuns.filter(i => i.status === "Completed").length;

    const [comments, setComments] = useState<string>("");

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return format(date, "dd MMM yyyy, HH:mm:ss", { locale: es });
        } catch (e) {
            return dateStr;
        }
    };

    const handleConfirm = () => {
        sendMediatorRequest({ command: new ReleaseRun(run.id, comments) });
    };

    const handleCancel = () => { };


    return (
        <div className="flex flex-col min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] overflow-hidden">
            <div className="flex items-center gap-2 bg-tableBg py-3 px-6 rounded-[10px] w-full flex-shrink-0">
                <Typography className="uppercase !text-primary !font-semibold">{run.roundId}</Typography>
                <Typography className="uppercase">{run.rootLocationId}</Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow mt-4 overflow-hidden">
                <div className="flex flex-col bg-tableBg p-6 rounded-[10px]">
                    <h1 className="text-xl font-bold mb-4">{runDetailsTitle}</h1>
                    <span className="bg-[#313131] block p-[1px] w-full mb-5"></span>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-[#313131] p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <Typography className="text-grey82">ID:</Typography>
                                <Typography className="font-semibold">{run.id.substring(0, 8)}</Typography>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <Typography className="text-grey82">{runLocation}:</Typography>
                                <Typography className="font-semibold">{run.rootLocationId}</Typography>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <Typography className="text-grey82">{runStartedAt}:</Typography>
                                <Typography className="font-semibold">{formatDate(run.startedAt)}</Typography>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <Typography className="text-grey82">{runStatus}:</Typography>
                                <Typography className="font-semibold">{run.status}</Typography>
                            </div>
                            <div className="flex justify-between items-center">
                                <Typography className="text-grey82">{inspectionsCompleted}:</Typography>
                                <Typography className="font-semibold">{completedInspections} / {run.inspectionRuns.length}</Typography>
                            </div>
                        </div>

                        <div className="mt-2">
                            <h2 className="text-lg font-bold mb-2">{runInspections}</h2>
                            <div className="max-h-[400px] overflow-y-auto pr-1">
                                {run.inspectionRuns.map((inspection, index) => (
                                    <div
                                        key={inspection.inspectionId}
                                        className="bg-[#313131] p-3 rounded-lg mb-2 flex justify-between items-center relative"
                                    >
                                        {/* <div
                                            className={`absolute top-1 right-1 w-2 h-2 rounded-full ${inspection.operationRun && inspection.operationRun.answers &&
                                                inspection.operationRun.answers.some(a => a.answer && a.answer.isAnomalous === true)
                                                ? inspection.operationRun.answers.filter(a => a.answer && a.answer.isAnomalous === true).length > 1
                                                    ? "bg-red-500"
                                                    : "bg-yellow-500"
                                                : "bg-green-500"
                                                }`}
                                        ></div> */}

                                        <div>
                                            <Typography className="font-semibold">{inspection.cameraDescription}</Typography>
                                            <Typography className="text-sm text-grey82">
                                                {formatDate(inspection.startedAt)}
                                            </Typography>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs ${inspection.operationRun && inspection.operationRun.answers &&
                                                inspection.operationRun.answers.some(a => a.answer && a.answer.isAnomalous === true)
                                                ?
                                                inspection.operationRun.answers.filter(a => a.answer && a.answer.isAnomalous === true).length > 1
                                                    ? "bg-red-900 text-red-300"
                                                    : "bg-yellow-900 text-yellow-300"
                                                : "bg-green-900 text-green-300"
                                            }`}>
                                            {inspection.operationRun && inspection.operationRun.answers &&
                                                inspection.operationRun.answers.some(a => a.answer && a.answer.isAnomalous === true)
                                                ? inspection.operationRun.answers.filter(a => a.answer && a.answer.isAnomalous === true).length > 1
                                                    ? "Múltiples anomalías"
                                                    : "Anomalía detectada"
                                                : "Normal"
                                            }
                                        </span>
                                        {/* <span className={`px-2 py-1 rounded-full text-xs ${inspection.status === "Completed"
                                            ? "bg-green-900 text-green-300"
                                            : "bg-yellow-900 text-yellow-300"
                                            }`}>
                                            {inspection.status}
                                        </span> */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col bg-tableBg p-6 rounded-[10px]">
                    <div className="flex-shrink-0">
                        <h1 className="text-xl font-bold mb-4">{title}</h1>
                        <span className="bg-[#313131] block p-[1px] w-full mb-5"></span>
                    </div>

                    <div className="flex-grow">
                        <div className="mb-8 flex flex-col">


                            <Typography className="mb-3">{additionalComments}</Typography>
                            <textarea
                                className="bg-[#313131] w-full min-h-[120px] p-3 rounded"
                                onChange={e => setComments(e.target.value)}
                                value={comments}
                                placeholder="Escribe aquí tus comentarios finales sobre la ronda..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-4 flex-shrink-0">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="text-xs uppercase bg-[#313131] text-white font-bold py-2 px-8 rounded-full hover:bg-opacity-80"
                        >
                            {cancelButtonText}
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            className="text-xs uppercase bg-secondary text-white font-bold py-2 px-8 rounded-full hover:bg-secondaryHover"
                        >
                            {confirmButtonText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}