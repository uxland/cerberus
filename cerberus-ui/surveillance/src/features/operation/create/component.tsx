import { useEffect, useState } from 'react';
import { SurveillanceOperationForm } from './ui/component';
import { defaultOperationModel, SurveillanceOperationFormModel } from "./domain";
import { EditOrCreateOperation } from "./command.ts";
import { useParams } from "react-router-dom";
import { GetOperation } from "./get-operation.ts";
import { nop } from "@cerberus/core";
import { CircularProgress, Box } from '@mui/material';
import { sendMediatorRequest } from '@cerberus/core';

export const SurveillanceOperationEditor = () => {

    const [error, setError] = useState<string | undefined>(undefined);
    const [busy, setBusy] = useState<boolean>(false);
    const [originalOperation, setOriginalOperation] = useState<SurveillanceOperationFormModel | undefined>(defaultOperationModel);
    const { operationId } = useParams<{ operationId: string }>();

    useEffect(() => {
        async function fetchOperation() {
            if (operationId && operationId !== "new") {
                sendMediatorRequest({
                    command: new GetOperation(operationId),
                    setBusy: setBusy,
                    setError: setError,
                    setState: setOriginalOperation
                });
            }
        }
        fetchOperation().then(nop);
    }, [operationId]);

    const submitOperation = async (operation: SurveillanceOperationFormModel) => {
        // console.log("Operation", operation);
        const command = new EditOrCreateOperation(operationId === "new" ? undefined : operationId, operation);
        sendMediatorRequest({
            command: command,
            setBusy: setBusy,
            setError: setError,
        })
    }

    return (
        <div className="space-y-6">
            {busy ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            ) : (
                <SurveillanceOperationForm initialModel={originalOperation} onSubmitRequested={submitOperation} />
            )}
            {error && <div>Error: {String(error)}</div>}
        </div>
    );
}