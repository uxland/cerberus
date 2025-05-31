import { Typography } from "@mui/material";
import { format } from 'date-fns';
import { useEffect } from "react";
import { useSurveillanceLocales } from "../../../../locales/ca/locales";

const formatDate = (dateString) => {
    try {
        const date = new Date(dateString);
        return format(date, 'HH:mm:ss');
    } catch (error) {
        return dateString;
    }
};

export const RunCard = (run: any) => {
    const anomaliesBadgeColor = run.totalAnomalies > 0
        ? "bg-red-600 text-white"
        : "bg-green-600 text-white";

    const inspectionBadgeColor = run.inspectionWithAnomalies > 0
        ? "bg-orange-600 text-white"
        : "bg-green-600 text-white";

    const locationLabel = useSurveillanceLocales("run.card.location");
    const roundLabel = useSurveillanceLocales("run.card.round");
    const performerLabel = useSurveillanceLocales("run.card.performer");
    const durationLabel = useSurveillanceLocales("run.card.duration");
    const anomaliesLabel = useSurveillanceLocales("run.card.anomalies");
    const inspectionsWithIssuesLabel = useSurveillanceLocales("run.card.inspectionsWithIssues");

    useEffect(() => {
        console.log("RunCard component mounted", run);
    }, []);

    return (
        <div key={run.id} className="rounded-[10px] p-5 bg-[#292929] border border-[#444444] hover:border-[#555555] hover:bg-[#313131] transition duration-300 ease-in-out">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                    <div>
                        <Typography className="!text-gray-400 uppercase !font-semibold text-xs mb-1">{locationLabel}</Typography>
                        <Typography className="font-medium text-white">
                            {run.locationDescription} <span className="text-gray-400">({run.locationId})</span>
                        </Typography>
                    </div>
                    <div>
                        <Typography className="!text-gray-400 uppercase !font-semibold text-xs mb-1">{roundLabel}</Typography>
                        <Typography className="text-white">{run.roundDescription}</Typography>
                    </div>
                </div>
                <div className="flex-1 space-y-4">
                    <div>
                        <Typography className="!text-gray-400 uppercase !font-semibold text-xs mb-1">{performerLabel}</Typography>
                        <Typography className="text-white">{run.performer}</Typography>
                    </div>
                    <div>
                        <Typography className="!text-gray-400 uppercase !font-semibold text-xs mb-1">{durationLabel}</Typography>
                        <Typography className="text-white">
                            {formatDate(run.startTime)} - {formatDate(run.endTime)}
                        </Typography>
                    </div>
                    <div className="flex items-center gap-3 mt-5">
                        <span className={`inline-flex py-1 px-2.5 rounded-md text-xs font-medium ${anomaliesBadgeColor}`}>
                            {run.totalAnomalies} {anomaliesLabel}
                        </span>
                        <span className={`inline-flex py-1 px-2.5 rounded-md text-xs font-medium ${inspectionBadgeColor}`}>
                            {run.inspectionWithAnomalies} {inspectionsWithIssuesLabel}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};