import React, { useState, useEffect } from 'react';
import { Typography } from "@mui/material";
import { RoundEditionData } from "../domain/model.ts";
import { MenuItem } from "@mui/material";
import Select from '@mui/material/Select';
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
import { CameraItem } from './camera-item.tsx';
import { CameraDetails } from './camera-details.tsx';

interface SurveillanceRoundFormArgs {
    roundEditionData?: RoundEditionData;
}

export const RoundEditionForm = ({ roundEditionData, onSubmitRequested }: { roundEditionData: RoundEditionData, onSubmitRequested: any }) => {
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

    const cameraDetails = useSurveillanceLocales("round.create.cameraDetails");
    const cameraName = useSurveillanceLocales("round.create.cameraName");
    const operation = useSurveillanceLocales("round.create.operation");
    const streamingUrl = useSurveillanceLocales("round.create.streamingUrl");
    const noOperationAssigned = useSurveillanceLocales("round.create.noOperationAssigned");
    const assignOperation = useSurveillanceLocales("round.create.assignOperation");
    const selectCamera = useSurveillanceLocales("round.create.selectCamera");
    const cameraId = useSurveillanceLocales("round.create.cameraId");
    const changeOperation = useSurveillanceLocales("round.create.changeOperation");

    const handleOperationSelectFromDetails = (operationId: string) => {
        if (!operationId && selectedCamera) {
            setCameraAssignments(prev => {
                const newAssignments = { ...prev };
                delete newAssignments[selectedCamera];
                return newAssignments;
            });
            return;
        }

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
        }
    };

    const handleCameraSelect = (locationId: string) => {
        setSelectedCamera(locationId);
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

            <div className="grid grid-cols-5 gap-6">
                <div className="col-span-4 grid grid-cols-4 gap-6">
                    {/* <button className="bg-primary py-4 px-6 rounded-md text-black font-bold text-xl hover:bg-formSelect">{useSurveillanceLocales("round.create.addCamera")}</button>
                    <button className="bg-[#313131] py-4 px-6 rounded-md text-white font-bold text-xl hover:bg-[#505050]">{useSurveillanceLocales("round.create.addGroup")}</button> */}
                    <div className="flex flex-col justify-center bg-tableBg px-4 py-2 rounded-md gap-2">
                        <Typography className="!text-xs !font-semibold"> {(roundEditionData.locations).length} {useSurveillanceLocales("round.create.cameras")}</Typography>
                        <Typography className="!text-xs !font-semibold">{useSurveillanceLocales("round.create.cronExpression")} - {cronValue} </Typography>
                    </div>
                    <div className="flex flex-col justify-center bg-tableBg px-4 py-2 rounded-md gap-2">
                        <Typography className="!text-xs !font-semibold">{useSurveillanceLocales("round.create.groupAssigned")}: {selectedGroup}</Typography>
                        <Typography className="!text-xs !font-semibold">{useSurveillanceLocales("round.create.duration")}: 20 mins.</Typography>
                    </div>
                </div>
                <div className="col-span-1 flex items-center justify-end">
                    <button type='submit' className="w-full text-[0.8rem] uppercase bg-secondary text-white font-bold py-4 px-10 rounded-md hover:bg-secondaryHover">
                        {useSurveillanceLocales("round.create.proceed")}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-6">
                <div className="col-span-4 grid grid-cols-4 gap-6">
                    {roundEditionData?.round.inspections.map((camera) => (
                        <CameraItem
                            key={camera.cameraId}
                            camera={camera}
                            isSelected={selectedCamera === camera.cameraId}
                            hasOperation={!!cameraAssignments[camera.cameraId]}
                            operationDescription={cameraAssignments[camera.cameraId]?.operationDescription || ''}
                            onSelect={handleCameraSelect}
                        />
                    ))}
                </div>

                <div className="col-span-1">
                    <CameraDetails
                        camera={roundEditionData?.locations.find(c => c.id === selectedCamera) || null}
                        selectedCamera={selectedCamera}
                        assignedOperation={cameraAssignments[selectedCamera]}
                        cameraDetails={cameraDetails}
                        cameraId={cameraId}
                        cameraName={cameraName}
                        streamingUrl={streamingUrl}
                        operation={operation}
                        noOperationAssigned={noOperationAssigned}
                        assignOperation={assignOperation}
                        selectCamera={selectCamera}
                        changeOperation={changeOperation}
                        operations={roundEditionData.operations}
                        onOperationSelect={handleOperationSelectFromDetails}
                    />
                </div>
            </div>
            {errors.inspections && (
                <p className="text-red-500">{errors.inspections.message}</p>
            )}
        </form>
    );
};