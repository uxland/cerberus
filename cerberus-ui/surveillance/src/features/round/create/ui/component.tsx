import React, { useState } from 'react';
import { Typography } from "@mui/material";
import { RoundEditionData } from "../domain/model.ts";
import { LocationHierarchicalItem } from "@cerberus/organizational-structure";
import { OperationSummary } from "../../../operation/list-operations/model.ts";
import { Menu, MenuItem } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { FormInputField } from '@cerberus/core';
import { useSurveillanceLocales } from '../../../../locales/ca/locales.ts';

interface SurveillanceRoundFormArgs {
    roundEditionData?: RoundEditionData;
}

export const RoundEditionForm = ({ roundEditionData }) => {
    const [cameraAssignments, setCameraAssignments] = useState<{ [cameraId: string]: string }>({});
    const [selectedCamera, setSelectedCamera] = useState<string>('');

    const handleOperationSelect = (event: SelectChangeEvent<string>) => {
        const operationId = event.target.value as string;
        setCameraAssignments(prev => ({
            ...prev,
            [selectedCamera]: operationId
        }));
        console.log(cameraAssignments);
    };

    const handleCameraSelect = (locationId: string) => {
        setSelectedCamera(locationId);
    };

    const getSelectedOperationForCamera = (cameraId: string): string => {
        return cameraAssignments[cameraId] || '';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 bg-tableBg py-4 px-6 rounded-[10px] w-full">
                <h1 className="font-bold text-primary">{useSurveillanceLocales("round.create.title")}</h1>
                <FormInputField
                    name="name"
                    register={() => { }}
                    placeholder={useSurveillanceLocales("round.create.placeholder")}
                    type="text"
                />
            </div>
            <div className="flex gap-4">
                <button className="bg-primary py-4 px-6 rounded-md text-black font-bold text-xl hover:bg-formSelect">{useSurveillanceLocales("round.create.addCamera")}</button>
                <button className="bg-[#313131] py-4 px-6 rounded-md text-white font-bold text-xl hover:bg-[#505050]">{useSurveillanceLocales("round.create.addGroup")}</button>
                <div className="flex flex-col justify-center bg-tableBg px-4 rounded-md gap-2">
                    <Typography className="!text-xs !font-semibold"> {(roundEditionData.locations).length} {useSurveillanceLocales("round.create.cameras")}</Typography>
                    <Typography className="!text-xs !font-semibold">Diario - 10:00 p.m.</Typography>
                </div>
                <div className="flex flex-col justify-center bg-tableBg px-4 rounded-md gap-2">
                    <Typography className="!text-xs !font-semibold">{useSurveillanceLocales("round.create.groupAssigned")}: Grupo 1</Typography>
                    <Typography className="!text-xs !font-semibold">{useSurveillanceLocales("round.create.duration")}: 20 mins.</Typography></div>

                <div className="flex gap-4 items-center ml-auto">
                    <Select
                        value={getSelectedOperationForCamera(selectedCamera)}
                        onChange={handleOperationSelect}
                        IconComponent={KeyboardArrowDownIcon}
                        displayEmpty
                        size="medium"
                        className="!text-[0.8rem] uppercase bg-[#313131] text-white font-bold  px-6 rounded-full hover:bg-[#505050] flex items-center justify-center"
                        renderValue={(selected) =>
                            selected
                                ? <span className="font-bold">
                                    {roundEditionData.operations
                                        .filter((o) => o.id === selected)
                                        .map((o) => o.description)
                                        .join(', ')}
                                </span>
                                : <span className="font-bold">{useSurveillanceLocales("round.create.asignOperation")}</span>
                        }
                        sx={{
                            width: '250px',
                            '.MuiSvgIcon-root': {
                                color: 'white',
                            },
                        }}
                    >
                        {roundEditionData?.operations.map((operation) => (
                            <MenuItem key={operation.id} value={operation.id} className="!text-[0.7rem]">
                                {operation.description}
                            </MenuItem>
                        ))}
                    </Select>
                    <button className="text-[0.8rem] uppercase bg-secondary text-white font-bold py-4 px-10 rounded-sm ml-auto hover:bg-secondaryHover">
                        {useSurveillanceLocales("round.create.proceed")}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-6">
                {roundEditionData?.locations.map((location: LocationHierarchicalItem) => (
                    <div
                        key={location.id}
                        className="space-y-2 cursor-pointer"
                        onClick={() => handleCameraSelect(location.id)}
                    >
                        <img
                            className={`rounded-md  ${selectedCamera === location.id ? 'border border-[3px] border-primary' : 'opacity-50'}`}
                            src="https://estaticos-cdn.prensaiberica.es/clip/9c2226f5-ce32-4647-a314-71a85bb2eec0_source-aspect-ratio_default_0.jpg"
                            alt={location.description}
                        />
                        <Typography className="text-center !text-xs px-2">{location.description}</Typography>
                    </div>
                ))}
            </div>

            {/* {roundEditionData && (
                <div>
                    <h2>Round Details</h2>
                    <p>Round ID: {roundEditionData.round.id}</p>
                    <p>Root Location ID: {roundEditionData.round.rootLocationId}</p>

                    <h2>Operations</h2>
                    <ul>
                        {roundEditionData.operations.map((operation: OperationSummary) => (
                            <li key={operation.id}>
                                {operation.description} (ID: {operation.id})
                            </li>
                        ))}
                    </ul>
                </div>
            )} */}
        </div>
    );
};