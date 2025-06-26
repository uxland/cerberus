import { Typography } from "@mui/material";
import { useSurveillanceLocales } from "../../../../locales/ca/locales";

export const NoData = () => {
    const title = useSurveillanceLocales("run.list.noData.title");
    const description = useSurveillanceLocales("run.list.noData.description");

    return (
        <div className="flex justify-center items-center h-[70vh]">
            <div className="flex flex-col gap-3 bg-tableBg py-8 px-10 rounded-[10px] max-w-md text-center shadow-sm">
                <Typography variant="h6" className="!font-medium">
                    {title}
                </Typography>
                <Typography className="text-gray-600">
                    {description}
                </Typography>
            </div>
        </div>
    );
};