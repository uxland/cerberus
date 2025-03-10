import React, { useState, useEffect } from 'react';
import { LocationHierarchicalItem } from "@cerberus/organizational-structure";
import { FormControl, Select, MenuItem } from "@mui/material";

interface CameraDetailsProps {
    camera: LocationHierarchicalItem | null;
    selectedCamera: string;
    assignedOperation?: {
        operationId: string;
        operationDescription: string;
        cameraId: string;
        cameraDescription: string;
        cameraStreamingUrl?: string;
    };
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
    camera,
    selectedCamera,
    assignedOperation,
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

    useEffect(() => {
        if (assignedOperation) {
            setSelectedOperation(assignedOperation.operationId);
        } else {
            setSelectedOperation('');
        }
    }, [selectedCamera, assignedOperation]);

    const handleOperationChange = (
        eventOrValue: React.ChangeEvent<{ value: unknown }> | string
    ) => {
        const operationId = typeof eventOrValue === 'string'
            ? eventOrValue
            : eventOrValue.target.value as string;

        setSelectedOperation(operationId);

        onOperationSelect(operationId);
    };

    if (!selectedCamera) {
        return (
            <div className="bg-tableBg rounded-md p-4 h-full flex items-center justify-center">
                <p className="text-gray-400">
                    {selectCamera}
                </p>
            </div>
        );
    }

    if (!camera) {
        return (
            <div className="bg-tableBg rounded-md p-4 h-full">
                <p>Cámara no encontrada</p>
            </div>
        );
    }

    return (
        <div className="bg-tableBg rounded-md p-4 h-full">
            <h2 className="font-bold text-primary text-xl mb-4">
                {cameraDetails}
            </h2>

            <div className="space-y-4">
                <div className="w-full">
                    <img
                        className="w-full h-32 object-cover rounded-md"
                        src="https://estaticos-cdn.prensaiberica.es/clip/9c2226f5-ce32-4647-a314-71a85bb2eec0_source-aspect-ratio_default_0.jpg"
                        alt={camera.description}
                    />
                </div>

                <div className="space-y-2">
                    <div>
                        <p className="text-xs text-gray-400">{cameraId}</p>
                        <p className="font-medium">{camera.id}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">{cameraName}</p>
                        <p className="font-medium">{camera.description}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">{streamingUrl}</p>
                        <p className="font-medium">{camera.streamingUrl || "-"}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">{operation}</p>
                        {assignedOperation ? (
                            <p className="font-medium text-green-500">
                                {assignedOperation.operationDescription}
                            </p>
                        ) : (
                            <FormControl fullWidth size="small" className="mt-1">
                                <p className="font-medium text-red-500 mb-4">
                                    {noOperationAssigned}
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

                {assignedOperation && (
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