import { Typography } from "@mui/material";

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
            src="https://estaticos-cdn.prensaiberica.es/clip/9c2226f5-ce32-4647-a314-71a85bb2eec0_source-aspect-ratio_default_0.jpg"
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