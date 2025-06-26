import { useEffect, useState } from 'react';
import { SurveillanceOperationForm } from './ui/component';
import { defaultOperationModel, SurveillanceOperationFormModel } from "./domain";
import { EditOrCreateOperation } from "./command.ts";
import { useParams } from "react-router-dom";
import { GetOperation } from "./get-operation.ts";
import { CircularProgress, Box } from '@mui/material';
import { sendMediatorRequest } from '@cerberus/core';
import { ErrorView } from '@cerberus/core';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useSurveillanceLocales } from '../../../locales/ca/locales.ts';

export const SurveillanceOperationEditor = () => {
    const error403 = useSurveillanceLocales("operation.errors.403");
    const error404 = useSurveillanceLocales("operation.errors.404");
    const error500 = useSurveillanceLocales("operation.errors.500");

    const [error, setError] = useState<AxiosError>(undefined);
    const [busy, setBusy] = useState<boolean>(false);
    const [originalOperation, setOriginalOperation] = useState<SurveillanceOperationFormModel | undefined>(defaultOperationModel);
    const { operationId } = useParams<{ operationId: string }>();
    const navigate = useNavigate();

    const fetchOperation = () => {
        if (operationId && operationId !== "new") {
            setError(undefined);
            sendMediatorRequest({
                command: new GetOperation(operationId),
                setBusy: setBusy,
                setError: setError,
                setState: setOriginalOperation
            });
        }
    };

    useEffect(() => {
        fetchOperation();
    }, [operationId]);

    const submitOperation = (operation: SurveillanceOperationFormModel) => {
        console.log("Operation", operation);
        const command = new EditOrCreateOperation(operationId === "new" ? undefined : operationId, operation);
        sendMediatorRequest({
            command: command,
            setBusy: setBusy,
            setError: setError,
        })
    }

    if (error) {
        return (
            <ErrorView
                error={error}
                onRefresh={fetchOperation}
                onGoBack={() => navigate("/surveillance/operations")}
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
                <SurveillanceOperationForm initialModel={originalOperation} onSubmitRequested={submitOperation} />
            )}
        </>
    );
}