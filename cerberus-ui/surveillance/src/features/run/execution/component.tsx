import { useEffect, useState } from 'react';
import { SurveillanceRunForm } from './ui/runForm.tsx';
import { GetRun } from "./query.ts";
import { useParams } from "react-router-dom";
import { nop } from "@cerberus/core";
import { CircularProgress, Box, Button } from '@mui/material';
import { Run } from './domain/model.ts';
import { SetRunInspection } from './command.ts';
import { OperationRunQuestionAnswer } from './domain/model.ts';
import { useSurveillanceLocales } from '../../../locales/ca/locales.ts';
import { sendMediatorRequest } from '@cerberus/core';
import { navigationService } from '@cerberus/core/src/routing/navigation-service.ts';

export const SurveillanceRunEditor = () => {
    const startButtonTitle = useSurveillanceLocales('run.set.start');
    const [start, setStart] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [busy, setBusy] = useState<boolean>(false);
    const [runEditionData, setRunEditionData] = useState<Run | undefined>(undefined);
    const { runId: id } = useParams<{ runId: string }>();

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
        if (start) {
            fetchOperation().then(nop);
        }
    }, [id, start]);

    const submitOperation = async (id: string, inspectionId: string, answers: OperationRunQuestionAnswer[]) => {
        console.log("Submit", id, inspectionId, answers);
        await sendMediatorRequest({
            command: new SetRunInspection(id, inspectionId, answers),
            setBusy: setBusy,
            setError: setError,
            setState: setRunEditionData
        });
    }

    const handleStart = () => {
        setStart(true);
    };

    const handleGoBack = () => {
        navigationService.navigateBack();
    };

    if (!start) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh" flexDirection="column" gap={2}>
                <Button variant="contained" color="primary" onClick={handleStart}>
                    {startButtonTitle}
                </Button>
                <Button variant="outlined" color="error" onClick={handleGoBack} sx={{ mt: 2 }}>
                    Volver
                </Button>
            </Box>
        );
    }

    return (
        <div className="space-y-6">
            {busy ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            ) : (
                <SurveillanceRunForm runEditionData={runEditionData} onSubmitRequested={submitOperation} />
            )}
            {error && <div>Error: {String(error)}</div>}
        </div>
    );
}