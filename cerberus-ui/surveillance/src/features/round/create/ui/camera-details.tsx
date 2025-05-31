import React, { useState, useEffect } from 'react';
import { LocationHierarchicalItem } from "@cerberus/organizational-structure";
import { FormControl, Select, MenuItem } from "@mui/material";

interface CameraDetailsProps {
    cameras: LocationHierarchicalItem[];
    selectedCameras: string[];
    assignedOperations?: {
        operationId: string;
        operationDescription: string;
        cameraId: string;
        cameraDescription: string;
        cameraStreamingUrl?: string;
    }[];
    cameraDetails: string;
    cameraId: string;
    cameraName: string;
    streamingUrl: string;
    operation: string;
    noOperationAssigned: string;
    assignOperation: string;
    selectCamera: string;
    changeOperation: string;
    operations: { id: string, description: string }[];
    onOperationSelect: (operationId: string) => void;
}

export const CameraDetails: React.FC<CameraDetailsProps> = ({
    cameras,
    selectedCameras,
    assignedOperations = [],
    cameraDetails,
    cameraId,
    cameraName,
    streamingUrl,
    operation,
    noOperationAssigned,
    assignOperation,
    selectCamera,
    changeOperation,
    operations,
    onOperationSelect,
}) => {
    const [selectedOperation, setSelectedOperation] = useState<string>('');

    // Check if all selected cameras have operations assigned
    const allCamerasHaveOperations = selectedCameras.length > 0 &&
        selectedCameras.every(cameraId =>
            assignedOperations.some(op => op.cameraId === cameraId)
        );

    const anyCameraHasOperation = selectedCameras.length > 0 &&
        selectedCameras.some(cameraId =>
            assignedOperations.some(op => op.cameraId === cameraId)
        );

    useEffect(() => {
        // Reset selected operation when selection changes
        setSelectedOperation('');
    }, [selectedCameras]);

    const handleOperationChange = (
        eventOrValue: React.ChangeEvent<{ value: unknown }> | string
    ) => {
        const operationId = typeof eventOrValue === 'string'
            ? eventOrValue
            : eventOrValue.target.value as string;

        setSelectedOperation(operationId);

        onOperationSelect(operationId);
    };

    if (selectedCameras.length === 0) {
        return (
            <div className="bg-tableBg rounded-md p-4 h-full flex items-center justify-center">
                <p className="text-gray-400">
                    {selectCamera}
                </p>
            </div>
        );
    }

    // Get camera IDs as comma-separated string
    const cameraIds = cameras.map(camera => camera.id).join(', ');
    // Get camera names as comma-separated string
    const cameraNames = cameras.map(camera => camera.description).join(', ');
    // Get a representative streaming URL (from the first camera with a URL)
    const representativeStreamingUrl = cameras.find(c => c.streamingUrl)?.streamingUrl || "-";

    return (
        <div className="bg-tableBg rounded-md p-4 h-full">
            <h2 className="font-bold text-primary text-xl mb-4">
                {cameraDetails} ({cameras.length})
            </h2>

            <div className="space-y-4">
                <div className="w-full">
                    <img
                        className="w-full h-32 object-cover rounded-md"
                        src="https://estaticos-cdn.prensaiberica.es/clip/9c2226f5-ce32-4647-a314-71a85bb2eec0_source-aspect-ratio_default_0.jpg"
                        alt="Camera preview"
                    />
                </div>

                <div className="space-y-2">
                    <div>
                        <p className="text-xs text-gray-400">{cameraId}</p>
                        <p className="font-medium">{cameraIds}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">{cameraName}</p>
                        <p className="font-medium">{cameraNames}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">{streamingUrl}</p>
                        <p className="font-medium">{representativeStreamingUrl}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">{operation}</p>
                        {allCamerasHaveOperations ? (
                            <p className="font-medium text-green-500">
                                {selectedCameras.length === 1 ?
                                    assignedOperations[0]?.operationDescription :
                                    "Multiple operations assigned"}
                            </p>
                        ) : (
                            <FormControl fullWidth size="small" className="mt-1">
                                <p className="font-medium text-red-500 mb-4">
                                    {anyCameraHasOperation ? "Some cameras don't have operations" : noOperationAssigned}
                                </p>
                                <Select
                                    value={selectedOperation}
                                    onChange={handleOperationChange}
                                    displayEmpty
                                    className="!text-[0.8rem] bg-[#313131] text-white hover:bg-[#505050]"
                                    sx={{
                                        '.MuiSvgIcon-root': {
                                            color: 'white',
                                        },
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                backgroundColor: '#1e1e1e',
                                                color: 'white',
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                        <em>{assignOperation}</em>
                                    </MenuItem>
                                    {operations.map((op) => (
                                        <MenuItem
                                            key={op.id}
                                            value={op.id}
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: '#333',
                                                },
                                                '&.Mui-selected': {
                                                    backgroundColor: '#444',
                                                },
                                            }}
                                        >
                                            {op.description}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    </div>
                </div>

                {allCamerasHaveOperations && (
                    <button
                        type="button"
                        className="w-full text-[0.8rem] uppercase bg-primary text-black font-bold py-2 px-4 rounded-sm hover:bg-formSelect"
                        onClick={() => handleOperationChange('')}
                    >
                        {changeOperation}
                    </button>
                )}
            </div>
        </div>
    );
};