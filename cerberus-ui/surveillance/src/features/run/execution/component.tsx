import { useEffect, useState } from 'react';
import { SurveillanceRunForm } from './ui/runForm.tsx';
import { GetRun } from "./query.ts";
import { useParams } from "react-router-dom";
import { Mediator } from "mediatr-ts";
import { nop } from "@cerberus/core";
import { CircularProgress, Box, Button } from '@mui/material';
import { Run } from './domain/model.ts';
import { SetRunInspection } from './command.ts';
import { OperationRunQuestionAnswer } from './domain/model.ts';

export const SurveillanceRunEditor = () => {
    const [start, setStart] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [busy, setBusy] = useState<boolean>(false);
    const [runEditionData, setRunEditionData] = useState<Run | undefined>(undefined);
    const { runId: id } = useParams<{ runId: string }>();

    useEffect(() => {
        console.log(id);
        async function fetchOperation() {
            if (id) {
                try {
                    setBusy(true);
                    await new Mediator().send(new GetRun(id, setRunEditionData, setBusy, setError));
                } finally {
                    setBusy(false);
                }
            }
        }
        if (start) {
            fetchOperation().then(nop);
        }
    }, [id, start]);

    const submitOperation = async (id: string, inspectionId: string, answers: OperationRunQuestionAnswer[]) => {

        await new Mediator().send(new SetRunInspection(id, inspectionId, answers, setRunEditionData, setBusy));
    }

    const handleStart = () => {
        setStart(true);
    };

    if (!start) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Button variant="contained" color="primary" onClick={handleStart}>
                    Empezar ronda de supervisión ahora
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