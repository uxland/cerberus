import { useEffect, useState } from 'react';
import { SurveillanceRunForm } from './ui/component';
import { GetRun } from "./query.ts";
import { useParams } from "react-router-dom";
import { Mediator } from "mediatr-ts";
import { nop } from "@cerberus/core";
import { CircularProgress, Box } from '@mui/material';
import { Run } from './domain/model.ts';
import { EditOrCreateRun } from './command.ts';

export const SurveillanceRunEditor = () => {

    const [error, setError] = useState<string | undefined>(undefined);
    const [busy, setBusy] = useState<boolean>(false);
    const [loadingModel, setLoadingModel] = useState<boolean>(false);
    const [runEditionData, setRunEditionData] = useState<Run | undefined>(undefined);
    const { id } = useParams<{ id: string }>();
    useEffect(() => {
        console.log(id);
        async function fetchOperation() {
            if (id) {
                try {
                    setLoadingModel(true);
                    await new Mediator().send(new GetRun(id, setRunEditionData, setBusy, setError));
                } finally {
                    setLoadingModel(false);
                }
            }
        }
        fetchOperation().then(nop);
    }, [id]);

    const submitOperation = async (run: Run) => {
        await new Mediator().send(new EditOrCreateRun(undefined, run, setBusy, setError));
    }

    return (
        <div className="space-y-6">
            {(busy || loadingModel) ? (
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