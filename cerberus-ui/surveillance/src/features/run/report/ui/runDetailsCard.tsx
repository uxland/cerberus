import { Typography } from "@mui/material";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Run } from "../../execution/domain/model";
import { useSurveillanceLocales } from "../../../../locales/ca/locales";

interface RunDetailsCardProps {
    run: Run;
}

const formatDate = (dateStr: string) => {
    try {
        const date = new Date(dateStr);
        return format(date, "dd MMM yyyy, HH:mm:ss", { locale: es });
    } catch (e) {
        return dateStr || "";
    }
};

export const RunDetailsCard = ({ run }: RunDetailsCardProps) => {
    const idLabel = useSurveillanceLocales("run.report.detailsCard.id");
    const locationLabel = useSurveillanceLocales("run.report.detailsCard.location");
    const startLabel = useSurveillanceLocales("run.report.detailsCard.start");
    const statusLabel = useSurveillanceLocales("run.report.detailsCard.status");
    const inspectionsLabel = useSurveillanceLocales("run.report.detailsCard.inspections");
    const notApplicable = useSurveillanceLocales("run.common.notApplicable");

    return (
        <div className="bg-[#313131] p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
                <Typography className="text-grey82">{idLabel}:</Typography>
                <Typography className="font-semibold">{run.id ? run.id.substring(0, 8) : notApplicable}</Typography>
            </div>
            <div className="flex justify-between items-center mb-2">
                <Typography className="text-grey82">{locationLabel}:</Typography>
                <Typography className="font-semibold">{run.rootLocationId || notApplicable}</Typography>
            </div>
            <div className="flex justify-between items-center mb-2">
                <Typography className="text-grey82">{startLabel}:</Typography>
                <Typography className="font-semibold">{run.startedAt ? formatDate(run.startedAt) : notApplicable}</Typography>
            </div>
            <div className="flex justify-between items-center mb-2">
                <Typography className="text-grey82">{statusLabel}:</Typography>
                <Typography className="font-semibold">{run.status || notApplicable}</Typography>
            </div>
            <div className="flex justify-between items-center">
                <Typography className="text-grey82">{inspectionsLabel}:</Typography>
                <Typography className="font-semibold">
                    {run.inspectionRuns?.length || 0} / {run.inspectionRuns?.length || 0}
                </Typography>
            </div>
        </div>
    );
};