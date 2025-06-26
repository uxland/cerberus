import { useEffect, useState } from 'react';
import { GetRun } from "./query.ts";
import { useParams } from "react-router-dom";
import { CircularProgress, Box } from '@mui/material';
import { Run, RunStatus } from './domain/model.ts';
import { ErrorView, sendMediatorRequest } from '@cerberus/core';
import { IRequest } from "mediatr-ts";
import * as React from "react";
import { ExecutionStepArgs } from "./model.ts";
import { StartSurveillanceRun } from "./start";
import { InspectionRunEditor } from "./run-inspection/component.tsx";
import ReleaseSurveillanceRun from "./release/component.tsx";
import { useSurveillanceLocales } from '../../../locales/ca/locales.ts';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

export const SurveillanceRunEditor = () => {
    const error403 = useSurveillanceLocales("run.errors.get.403");
    const error404 = useSurveillanceLocales("run.errors.get.404");
    const error500 = useSurveillanceLocales("run.errors.get.500");

    const [error, setError] = useState<AxiosError>(undefined);
    const [busy, setBusy] = useState<boolean>(false);
    const [runEditionData, setRunEditionData] = useState<Run | undefined>(undefined);
    const { locationId: locationId, runId: id } = useParams<{ locationId: string, runId: string }>();

    const navigate = useNavigate();

    const executeStep = (command: IRequest<Run>) => {
        sendMediatorRequest({
            command: command,
            setBusy: setBusy,
            setError: setError,
            setState: setRunEditionData
        });
    }

    const fetchOperation = () => {
        if (id) {
            setError(undefined);
            sendMediatorRequest({
                command: new GetRun(id),
                setBusy: setBusy,
                setError: setError,
                setState: setRunEditionData
            });
        }
    }

    useEffect(() => {
        fetchOperation();
    }, [id]);

    const StepComponent = drawContent(runEditionData);
    const stepData: ExecutionStepArgs = { run: runEditionData, handler: executeStep };


    if (error) {
        return (
            <ErrorView
                error={error}
                onRefresh={fetchOperation}
                onGoBack={() => navigate("/locations/" + locationId + "?item-type=Location&tab=2")}
                customMessages={{
                    403: error403,
                    404: error404,
                    500: error500
                }}
            />
        );
    }

    return (
        <>
            {busy ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <CircularProgress />
                </Box>
            ) : (
                <StepComponent {...stepData} />
            )}
        </>
    )
}

type ExecutionFactory = (args: ExecutionStepArgs) => React.ComponentType;
const componentsMap: { [key: string]: ExecutionFactory } = {
    [RunStatus.Pending]: StartSurveillanceRun,
    [RunStatus.Running]: InspectionRunEditor,
    [RunStatus.Completed]: ReleaseSurveillanceRun
}
const NoContent = () => {
    return (<div>...</div>);
}

const drawContent: (run: Run | undefined) => React.ComponentType = (run) => {
    if (!run) return NoContent
    const factory = componentsMap[run.status];
    return factory
}
