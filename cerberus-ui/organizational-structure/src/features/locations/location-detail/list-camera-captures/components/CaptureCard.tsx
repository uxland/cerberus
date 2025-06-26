import { getImageUrl } from "@cerberus/core";
import { ImageComponent } from "@cerberus/maintenance";
import { Typography } from "@mui/material";
import { format } from "date-fns/format";
import { Capture } from "../model.ts";
import { useOrganizationalStructureLocales } from "../../../../../locales/ca/locales.ts";

const formatDateString = (dateString: string | Date): string => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return format(date, "dd/MM/yyyy hh:mm:ss a");
};

export const CaptureCard = ({ capture }: { capture: Capture }) => {
    const capturedAtLabel = useOrganizationalStructureLocales("views.capturedAt");
    const cameraLabel = useOrganizationalStructureLocales("views.camera");

    return (
        <div className="flex flex-col gap-2 min-w-52">
            <div className="flex flex-col gap-1">
                <Typography variant="body1">
                    {capturedAtLabel}: {formatDateString(capture.at)}
                </Typography>
                <Typography variant="body1">
                    {cameraLabel}: {capture.cameraId}
                </Typography>
            </div>
            <div className="flex flex-col gap-2">
                <ImageComponent
                    src={getImageUrl(capture.thumbnailPath)}
                    alt={`Capture from camera ${capture.cameraId}`}
                    className="image !h-32"
                    size="small"
                />
            </div>
        </div>
    );
};
