import {useState} from 'react';
import { SurveillanceOperationForm } from './ui/component';
import {SurveillanceOperationFormModel} from "./domain";
import {EditOrCreateOperation} from "./command.ts";
import {useParams} from "react-router-dom";
import {Mediator} from "mediatr-ts";
export const SurveillanceOperationEditor = () => {

    const [error, setError] = useState<string | undefined>(undefined);
    const [busy, setBusy] = useState<boolean>(false);
    const {operationId} = useParams<{operationId: string}>();

    const submitOperation = async (operation: SurveillanceOperationFormModel) => {
        const command = new EditOrCreateOperation(operationId === "new" ? undefined : operationId, operation, setBusy, setError);
        await new Mediator().send(command);
    }

    return (
        <div className="space-y-6">
            {busy &&<div>Busy</div>}
            <SurveillanceOperationForm initialModel={{ name: "", questions: [] }} onSubmitRequested={submitOperation} />
            {error && <div>Error: {error}</div>}
        </div>
    );
}