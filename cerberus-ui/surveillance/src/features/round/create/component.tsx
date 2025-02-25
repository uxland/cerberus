import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { RoundEditionData } from "./domain";
import { Mediator } from "mediatr-ts";
import { GetRoundEditionData } from "./get-round-edition-data.ts";
import { nop } from "@cerberus/core";
import { Round } from "./domain";
import { RoundEditionForm } from './ui/component.tsx';
import { EditOrCreateRound } from './command.ts';
export const SurveillanceRoundsEditor = () => {

    const [roundEditionData, setRoundEditionData] = useState<RoundEditionData>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const { locationId, roundId } = useParams<{ locationId: string, roundId: string }>();
    useEffect(() => {
        // const cameras = new Mediator().send(new ListCaptureCameras());
        async function fetchRoundData() {
            new Mediator().send(new GetRoundEditionData(locationId, roundId, setRoundEditionData, setBusy, setError));
        }
        fetchRoundData().then(nop);
    }, [locationId, roundId]);
    const submitRound = async (round: Round) => {
        const command = new EditOrCreateRound(roundId === "new" ? undefined : roundId, round, setBusy, setError);
        await new Mediator().send(command);
    }
    return (
        <div>
            {busy && <div>Busy</div>}
            {roundEditionData && <RoundEditionForm roundEditionData={roundEditionData} onSubmitRequested={submitRound} />}
            {error && <div>Error: {String(error)}</div>}
        </div>

    );
}