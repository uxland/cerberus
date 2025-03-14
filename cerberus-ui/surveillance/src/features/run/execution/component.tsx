import { useEffect, useState } from 'react';
import { SurveillanceRunForm } from './ui/runForm.tsx';
import { GetRun } from "./query.ts";
import { useParams } from "react-router-dom";
import { nop } from "@cerberus/core";
import { CircularProgress, Box, Button } from '@mui/material';
import { getCurrentInspectionRun, Run, RunStatus } from './domain/model.ts';
import { OperationRunQuestionAnswer } from './domain/model.ts';
import { sendMediatorRequest } from '@cerberus/core';
import { navigationService } from '@cerberus/core/src/routing/navigation-service.ts';
import { IRequest } from "mediatr-ts";
import * as React from "react";
import { ExecutionStepArgs, StepExecutor } from "./model.ts";
import { StartSurveillanceRun } from "./start";
import { InspectionRunEditor } from "./run-inspection/component.tsx";

export const SurveillanceRunEditor = () => {
    const [error, setError] = useState<string | undefined>(undefined);
    const [busy, setBusy] = useState<boolean>(false);
    const [runEditionData, setRunEditionData] = useState<Run | undefined>(undefined);
    const { runId: id } = useParams<{ runId: string }>();

    const executeStep = async (command: IRequest<Run>) => {
        await sendMediatorRequest({
            command: command,
            setBusy: setBusy,
            setError: setError,
            setState: setRunEditionData
        })
    }

    useEffect(() => {
        console.log(id);
        async function fetchOperation() {
            if (id) {
                await sendMediatorRequest({
                    command: new GetRun(id),
                    setBusy: setBusy,
                    setError: setError,
                    setState: setRunEditionData
                });
            }
        }
        fetchOperation().then(nop);

    }, [id]);
    const StepComponent = drawContent(runEditionData);
    const stepData: ExecutionStepArgs = { run: runEditionData, handler: executeStep };
    return (
        <div className="space-y-6">
            {busy ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            ) : (
                <StepComponent {...stepData} />
            )}
            {error && <div>Error: {String(error)}</div>}
        </div>
    )
}

type ExecutionFactory = (run: Run) => React.ComponentType;
const componentsMap: { [key: string]: ExecutionFactory } = {
    [RunStatus.Pending]: StartSurveillanceRun,
    [RunStatus.Running]: InspectionRunEditor,
}
const NoContent = () => {
    return (<div>...</div>);
}

const drawContent: (run: Run | undefined) => React.ComponentType = (run) => {
    if (!run) return NoContent
    const factory = componentsMap[run.status];
    return factory
}
