import React, { useState, useEffect } from 'react';
import { Typography, FormControl, InputLabel } from "@mui/material";
import { RoundEditionData } from "../domain/model.ts";
import { LocationHierarchicalItem } from "@cerberus/organizational-structure";
import { OperationSummary } from "../../../operation/list-operations/model.ts";
import { Menu, MenuItem } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { FormInputField } from '@cerberus/core';
import { useSurveillanceLocales } from '../../../../locales/ca/locales.ts';
import { Cron } from 'react-js-cron'
import 'react-js-cron/dist/styles.css';
import './style.css';
import { SPANISH_LOCALE } from './locale/cron-spanish.ts';
import { produceInspections } from '../domain/model.ts';
import { Round, roundSchema } from '../domain/validation.ts';
import { } from '../domain';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";

interface SurveillanceRoundFormArgs {
    roundEditionData?: RoundEditionData;
}

export const RoundEditionForm = ({ roundEditionData, onSubmitRequested }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<Round>({
        resolver: zodResolver(roundSchema),
        defaultValues: {
            id: roundEditionData.round.id || "",
            rootLocationId: roundEditionData.round.rootLocationId || "",
            estimatedDuration: 20,
            inspections: [],
        },
    });

    const [cameraAssignments, setCameraAssignments] = useState<{ [cameraId: string]: string }>({});
    const [selectedCamera, setSelectedCamera] = useState<string>('');
    const [cronValue, setCronValue] = useState('30 5 * * 1,6');
    const [selectedGroup, setSelectedGroup] = useState<string>('');
    const groups = ["Supervisor", "Operador", "Técnico"];

    useEffect(() => {
        console.log(roundEditionData);
    }, []);
    const asignOperation = useSurveillanceLocales("round.create.asignOperation");

    const handleOperationSelect = (event: SelectChangeEvent<string>) => {
        const operationId = event.target.value as string;
        const operation = roundEditionData.operations.find((o) => o.id === operationId);
        const camera = roundEditionData.locations.find((l) => l.id === selectedCamera);
        if (operation && camera) {
            setCameraAssignments(prev => ({
                ...prev,
                [selectedCamera]: {
                    operationId: operation.id,
                    operationDescription: operation.description,
                    cameraId: camera.id,
                    cameraDescription: camera.description,
                    cameraStreamingUrl: camera.streamingUrl,
                }
            }));
            console.log(cameraAssignments);
        } else {
            console.warn("Operation or camera not found for ID:", operationId, selectedCamera);
        }
    };

    const handleCameraSelect = (locationId: string) => {
        setSelectedCamera(locationId);
    };

    const getSelectedOperationForCamera = (cameraId: string): string => {
        return cameraAssignments[cameraId]?.operationId || '';
    };
    useEffect(() => {
        const inspections = produceInspections(cameraAssignments);
        setValue("inspections", inspections);
    }, [cameraAssignments, setValue]);

    useEffect(() => {
        setValue("cronExpression", cronValue);
        register("cronExpression");

    }, [cronValue, setValue]);
    const onSubmit = async (data: Round) => {
        onSubmitRequested?.(data as Round);
        console.log("SUCCESS", data);
    }
    console.log(errors);
    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className="flex flex-col gap-4 bg-tableBg py-4 px-6 rounded-[10px] w-full">
                <div className='flex gap-4 items-center'>
                    <h1 className="font-bold text-primary">{roundEditionData.round.rootLocationId} - {useSurveillanceLocales("round.create.title")}</h1>
                    <FormInputField
                        name="description"
                        register={register}
                        placeholder={useSurveillanceLocales("round.create.placeholder")}
                        type="text"
                        error={errors.description}
                    />
                </div>
                <div className='space-y-2 flex items-center gap-4 mt-1'>
                    <h1 className="font-bold text-primary mb-1">{useSurveillanceLocales("round.create.cronExpressionInput")}:</h1>
                    <Cron value={cronValue} setValue={setCronValue} className="my-project-cron" locale={SPANISH_LOCALE} />
                    {errors.cronExpression && (
                        <p className="text-red-500">{errors.cronExpression.message}</p>
                    )}
                </div>

                <div className='space-y-2 flex items-center gap-4'>
                    <h1 className="font-bold text-primary">{useSurveillanceLocales("round.create.groupInput")}:</h1>
                    <Select
                        name='assignedTo'
                        {...register('assignedTo')}
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                        displayEmpty
                        size="small"
                        className="!text-[0.8rem] uppercase bg-[#313131] text-white font-bold hover:bg-[#505050] flex items-center justify-center"
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
                        {groups.map((group, index) => (
                            <MenuItem
                                key={index}
                                value={group}
                                className="!text-[0.7rem]"
                                sx={{
                                    '&:hover': {
                                        backgroundColor: '#333',
                                    },
                                    '&.Mui-selected': {
                                        backgroundColor: '#444',
                                    },
                                }}
                            >
                                {group}
                            </MenuItem>
                        ))}
                    </Select>
                </div>
            </div>

            <div className="flex gap-4">
                <button className="bg-primary py-4 px-6 rounded-md text-black font-bold text-xl hover:bg-formSelect">{useSurveillanceLocales("round.create.addCamera")}</button>
                <button className="bg-[#313131] py-4 px-6 rounded-md text-white font-bold text-xl hover:bg-[#505050]">{useSurveillanceLocales("round.create.addGroup")}</button>
                <div className="flex flex-col justify-center bg-tableBg px-4 rounded-md gap-2">
                    <Typography className="!text-xs !font-semibold"> {(roundEditionData.locations).length} {useSurveillanceLocales("round.create.cameras")}</Typography>
                    <Typography className="!text-xs !font-semibold">{useSurveillanceLocales("round.create.cronExpression")} - {cronValue} </Typography>
                </div>
                <div className="flex flex-col justify-center bg-tableBg px-4 rounded-md gap-2">
                    <Typography className="!text-xs !font-semibold">{useSurveillanceLocales("round.create.groupAssigned")}: {selectedGroup}</Typography>
                    <Typography className="!text-xs !font-semibold">{useSurveillanceLocales("round.create.duration")}: 20 mins.</Typography></div>

                <div className="flex gap-4 items-center ml-auto">
                    <FormControl style={{ minWidth: 120 }}>
                        <InputLabel id="operation-select-label">{asignOperation}</InputLabel>
                        <Select
                            labelId="operation-select-label"
                            value={getSelectedOperationForCamera(selectedCamera)}
                            label="Operativa"
                            className="!text-[0.8rem] uppercase bg-[#313131] text-white font-bold hover:bg-[#505050] flex items-center justify-center"
                            sx={{
                                '.MuiSvgIcon-root': {
                                    color: 'white',
                                },
                            }}
                            onChange={handleOperationSelect}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        backgroundColor: '#1e1e1e',
                                        color: 'white',
                                    },
                                },
                            }}
                        >
                            <MenuItem key="remove" value="">
                                <em>Sin operativa</em>
                            </MenuItem>
                            {roundEditionData.operations.map((o) => (
                                <MenuItem
                                    key={o.id}
                                    value={o.id}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: '#333',
                                        },
                                        '&.Mui-selected': {
                                            backgroundColor: '#444',
                                        },
                                    }}>
                                    {o.description}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <button type='submit' className="text-[0.8rem] uppercase bg-secondary text-white font-bold py-4 px-10 rounded-sm ml-auto hover:bg-secondaryHover">
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
            {errors.inspections && (
                <p className="text-red-500">{errors.inspections.message}</p>
            )}
        </form>
    );
};