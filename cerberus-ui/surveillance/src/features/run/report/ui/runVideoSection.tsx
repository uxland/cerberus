import { Typography } from "@mui/material";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { InspectionRun } from "../../execution/domain/model";
import {getImageUrl} from "@cerberus/core";

interface RunVideoSectionProps {
    selectedInspection?: InspectionRun;
    videoNotSupported: string;
    cameraLabel: string;
    durationLabel: string;
    dateLabel: string;
    notAvailable: string;
    videoTitle: string;
}

const formatDate = (dateStr: string) => {
    try {
        const date = new Date(dateStr);
        return format(date, "dd MMM yyyy, HH:mm:ss", { locale: es });
    } catch (e) {
        return dateStr || "";
    }
};

const calculateDuration = (startDate: string, endDate: string): string => {
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diff = end.getTime() - start.getTime();
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } catch (e) {
        return "00:00";
    }
};

export const RunVideoSection = ({
    selectedInspection,
    videoNotSupported,
    cameraLabel,
    durationLabel,
    dateLabel,
    notAvailable,
    videoTitle,
}: RunVideoSectionProps) => {
    return (
        <div className="flex flex-col bg-tableBg p-6 rounded-[10px]">
            <div className="flex-shrink-0">
                <h1 className="text-xl font-bold mb-4">{videoTitle}</h1>
                <span className="bg-[#313131] block p-[1px] w-full mb-5"></span>
            </div>
            <div className="flex-grow flex flex-col">
                <div className="relative w-full h-0 pb-[56.25%] bg-[#1a1a1a] rounded-lg mb-4">
                    <video
                        className="absolute top-0 left-0 w-full h-full object-contain rounded-lg"
                        controls
                        poster={selectedInspection?.cameraStreamingUrl}
                    >
                        <source src={getImageUrl(selectedInspection.recordedClipPath)} type="video/mp4" />
                        {videoNotSupported}
                    </video>
                </div>
                <div className="bg-[#313131] p-4 rounded-lg space-y-3">
                    <Typography className="font-semibold text-lg text-primary border-b border-[#414141] pb-2">
                        Video Detalles
                    </Typography>
                    <div className="flex justify-between items-center">
                        <Typography className="text-grey82 font-medium">{cameraLabel}:</Typography>
                        <Typography className="font-semibold">
                            {selectedInspection ? selectedInspection.cameraDescription : notAvailable}
                        </Typography>
                    </div>
                    <div className="flex justify-between items-center">
                        <Typography className="text-grey82 font-medium">{durationLabel}:</Typography>
                        <Typography className="font-semibold">
                            {selectedInspection && selectedInspection.startedAt && selectedInspection.endedAt
                                ? calculateDuration(selectedInspection.startedAt, selectedInspection.endedAt)
                                : "00:00"}
                        </Typography>
                    </div>
                    <div className="flex justify-between items-center">
                        <Typography className="text-grey82 font-medium">{dateLabel}:</Typography>
                        <Typography className="font-semibold">
                            {selectedInspection && selectedInspection.startedAt
                                ? formatDate(selectedInspection.startedAt)
                                : notAvailable}
                        </Typography>
                    </div>
                </div>
            </div>
        </div>
    );
};