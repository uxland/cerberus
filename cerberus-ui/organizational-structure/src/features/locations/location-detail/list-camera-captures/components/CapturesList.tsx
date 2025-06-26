import { List, ListItem, Typography } from "@mui/material";
import { Capture } from "../model.ts";
import { CaptureCard } from "./CaptureCard";
import { useOrganizationalStructureLocales } from "../../../../../locales/ca/locales.ts";

export const CapturesList = ({ captures }: { captures: Capture[] }) => {
    const capturesLabel = useOrganizationalStructureLocales("views.captures");
    const noCapturesMessage = useOrganizationalStructureLocales("views.noCapturesAvailable");
    const noCapturesDescription = useOrganizationalStructureLocales("views.noCapturesDescription");

    if (captures.length === 0) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <div className="flex flex-col gap-3 bg-tableBg py-8 px-10 rounded-[10px] max-w-md text-center shadow-sm">
                    <Typography variant="h6" className="!font-medium">
                        {noCapturesMessage}
                    </Typography>
                    <Typography className="text-gray-600">
                        {noCapturesDescription}
                    </Typography>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <Typography variant="h5">
                {capturesLabel} ({captures.length})
            </Typography>
            <List className="grid sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-4 h-full flex-wrap">
                {captures.map((capture) => (
                    <ListItem key={capture.id}>
                        <CaptureCard capture={capture} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};


