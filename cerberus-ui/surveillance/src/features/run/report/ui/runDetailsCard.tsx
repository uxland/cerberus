import { Typography } from "@mui/material";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Run } from "../../execution/domain/model";

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
    return (
        <div className="bg-[#313131] p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
                <Typography className="text-grey82">ID:</Typography>
                <Typography className="font-semibold">{run.id ? run.id.substring(0, 8) : "N/A"}</Typography>
            </div>
            <div className="flex justify-between items-center mb-2">
                <Typography className="text-grey82">Ubicación:</Typography>
                <Typography className="font-semibold">{run.rootLocationId || "N/A"}</Typography>
            </div>
            <div className="flex justify-between items-center mb-2">
                <Typography className="text-grey82">Inicio:</Typography>
                <Typography className="font-semibold">{run.startedAt ? formatDate(run.startedAt) : "N/A"}</Typography>
            </div>
            <div className="flex justify-between items-center mb-2">
                <Typography className="text-grey82">Estado:</Typography>
                <Typography className="font-semibold">{run.status || "N/A"}</Typography>
            </div>
            <div className="flex justify-between items-center">
                <Typography className="text-grey82">Inspecciones:</Typography>
                <Typography className="font-semibold">
                    {run.inspectionRuns?.length || 0} / {run.inspectionRuns?.length || 0}
                </Typography>
            </div>
        </div>
    );
};