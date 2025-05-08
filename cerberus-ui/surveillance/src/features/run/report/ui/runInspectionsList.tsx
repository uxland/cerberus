import { Typography } from "@mui/material";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { InspectionRun } from "../../execution/domain/model";

interface RunInspectionsListProps {
    inspections: InspectionRun[];
    selectedInspectionId?: string;
    onSelectInspection: (inspection: InspectionRun) => void;
    singleAnomalyStatus: string;
    multipleAnomaliesStatus: string;
    normalStatus: string;
    runInspectionsTitle: string;
}

const formatDate = (dateStr: string) => {
    try {
        const date = new Date(dateStr);
        return format(date, "dd MMM yyyy, HH:mm:ss", { locale: es });
    } catch (e) {
        return dateStr || "";
    }
};

export const RunInspectionsList = ({
    inspections,
    selectedInspectionId,
    onSelectInspection,
    singleAnomalyStatus,
    multipleAnomaliesStatus,
    normalStatus,
    runInspectionsTitle,
}: RunInspectionsListProps) => {
    return (
        <div className="mt-2 flex flex-col h-full">
            <h2 className="text-lg font-bold mb-2">{runInspectionsTitle}</h2>
            <div className="h-0 flex-grow overflow-y-auto pr-1">
                {inspections.map((inspection) => {
                    const hasAnomaly =
                        inspection.operationRun &&
                        inspection.operationRun.answers &&
                        inspection.operationRun.answers.some(a => a.answer && a.answer.isAnomalous === true);
                    const anomalyCount = hasAnomaly
                        ? inspection.operationRun.answers.filter(a => a.answer && a.answer.isAnomalous === true).length
                        : 0;
                    const statusLabel = hasAnomaly
                        ? (anomalyCount > 1 ? multipleAnomaliesStatus : singleAnomalyStatus)
                        : normalStatus;

                    return (
                        <div
                            key={inspection.inspectionId}
                            className={`bg-[#313131] p-3 rounded-lg mb-2 flex justify-between items-center cursor-pointer ${selectedInspectionId === inspection.id ? "border border-primary" : ""}`}
                            onClick={() => onSelectInspection(inspection)}
                        >
                            <div>
                                <Typography className="font-semibold">{inspection.cameraDescription}</Typography>
                                <Typography className="text-sm text-grey82">
                                    {formatDate(inspection.startedAt)}
                                </Typography>
                            </div>
                            <span
                                className={`px-2 py-1 rounded-full text-xs ${hasAnomaly
                                    ? (anomalyCount > 1 ? "bg-red-900 text-red-300" : "bg-yellow-900 text-yellow-300")
                                    : "bg-green-900 text-green-300"
                                    }`}
                            >
                                {statusLabel}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};