import {useEffect, useState} from 'react';
import { SurveillanceOperationForm } from './ui/component';
import {defaultOperationModel, SurveillanceOperationFormModel} from "./domain";
import {EditOrCreateOperation} from "./command.ts";
import {useParams} from "react-router-dom";
import {Mediator} from "mediatr-ts";
import {GetOperation} from "./get-operation.ts";
import {nop} from "@cerberus/core";
export const SurveillanceOperationEditor = () => {

    const [error, setError] = useState<string | undefined>(undefined);
    const [busy, setBusy] = useState<boolean>(false);
    const [loadingModel, setLoadingModel] = useState<boolean>(false);
    const [originalOperation, setOriginalOperation] = useState<SurveillanceOperationFormModel | undefined>(defaultOperationModel);
    const {operationId} = useParams<{operationId: string}>();
    useEffect(() => {
        async function fetchOperation() {
            try {
                setLoadingModel(true);
                await new Mediator().send(new GetOperation(operationId, setOriginalOperation, setBusy, setError));
            } finally {
                setLoadingModel(false);
            }
        }
        fetchOperation().then(nop);
    }, [operationId]);

    const submitOperation = async (operation: SurveillanceOperationFormModel) => {
        const command = new EditOrCreateOperation(operationId === "new" ? undefined : operationId, operation, setBusy, setError);
        await new Mediator().send(command);
    }

    return (
        <div className="space-y-6">
            {busy &&<div>Busy</div>}
            {loadingModel === false && <SurveillanceOperationForm initialModel={originalOperation} onSubmitRequested={submitOperation} />}
            {error && <div>Error: {error}</div>}
        </div>
    );
}