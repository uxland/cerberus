import { useEffect, useState } from 'react';
import { SurveillanceRunForm } from './ui/runForm.tsx';
import { GetRun } from "./query.ts";
import { useParams } from "react-router-dom";
import { nop } from "@cerberus/core";
import { CircularProgress, Box, Button } from '@mui/material';
import {getCurrentInspectionRun, Run, RunStatus} from './domain/model.ts';
import { SetRunInspection } from './command.ts';
import { OperationRunQuestionAnswer } from './domain/model.ts';
import { sendMediatorRequest } from '@cerberus/core';
import { navigationService } from '@cerberus/core/src/routing/navigation-service.ts';
import {IRequest} from "mediatr-ts";
import * as React from "react";
import {StepExecutor} from "./model.ts";
import {StartSurveillanceRun} from "./start";
import {InspectionRunEditor} from "./run-inspection/component.tsx";

export const SurveillanceRunEditor = () => {
    const [error, setError] = useState<string | undefined>(undefined);
    const [busy, setBusy] = useState<boolean>(false);
    const [runEditionData, setRunEditionData] = useState<Run | undefined>(undefined);
    const { runId: id } = useParams<{ runId: string }>();

    const executeStep = async(command: IRequest<Run>) =>{
        await sendMediatorRequest({
            command,
            setBusy,
            setError,
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

    const submitOperation = async (id: string, inspectionId: string, answers: OperationRunQuestionAnswer[]) => {
        console.log("Submit", id, inspectionId, answers);
        await sendMediatorRequest({
            command: new SetRunInspection(id, inspectionId, answers),
            setBusy: setBusy,
            setError: setError,
            setState: setRunEditionData
        });
    }

    const handleGoBack = () => {
        navigationService.navigateBack();
    };

    return (
        <div className="space-y-6">
            {busy ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            ) : (
               drawContent({run: runEditionData, handler: executeStep})
            )}
            {error && <div>Error: {String(error)}</div>}
        </div>
    )
}


type ExecutionFactory = ({run: Run, handler: StepExecutor}) => React.Component;

const startExecution: ExecutionFactory = ({run, handler}) =>
    StartSurveillanceRun({runId: run.id, handler});

const runInspectionExecution: ExecutionFactory = ({run, handler}) =>{
    return InspectionRunEditor({inspection: getCurrentInspectionRun(run), handler})
}

const factories: {[key: string]: ExecutionFactory} = {
    [RunStatus.Pending]: startExecution,
    [RunStatus.Running]: runInspectionExecution,
}


const drawContent:  (props: {run: Run, handler: StepExecutor} ) => React.Component = ({run, handler}) => {
    if(!run) return (<div>...</div>);
    const factory = factories[run.status];
    return factory({run, handler});
}