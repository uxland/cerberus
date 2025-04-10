import { Typography } from "@mui/material";

export const NoData = () => {
    return (
        <div className="flex justify-center items-center h-[70vh]">
            <div className="flex flex-col gap-3 bg-tableBg py-8 px-10 rounded-[10px] max-w-md text-center shadow-sm">
                <Typography variant="h6" className="!font-medium">
                    Sin inspecciones disponibles
                </Typography>
                <Typography className="text-gray-600">
                    No se han encontrado inspecciones planificadas o ejecutadas.
                </Typography>
            </div>
        </div>
    )

};