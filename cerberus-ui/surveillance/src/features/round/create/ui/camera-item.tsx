import { Typography } from "@mui/material";
import {getImageUrl} from "@cerberus/core";

export const CameraItem = ({
    camera,
    isSelected,
    hasOperation,
    operationDescription,
    onSelect
}) => (
    <div
        className="space-y-2 cursor-pointer"
        onClick={() => onSelect(camera.id)}
    >
        <img
            className={`rounded-md ${isSelected ? 'border border-[3px] border-primary opacity-100' : ''} ${!hasOperation ? 'opacity-50' : ''}`}
            src={getImageUrl(camera.imageUrl)}
            alt={camera.description}
        />
        <Typography
            className={`text-center !text-xs px-2 ${!hasOperation ? '!text-red-500' : ''}`}
        >
            {camera.description}
            {hasOperation && (
                <span className="block font-medium text-primary"> {operationDescription}</span>
            )}
        </Typography>
    </div>
);