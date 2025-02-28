import React, { useState, useEffect } from 'react';
import { CircularProgress, Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { RoundEditionData } from "./domain";
import { Mediator } from "mediatr-ts";
import { GetRoundEditionData } from "./get-round-edition-data.ts";
import { nop } from "@cerberus/core";
import { Round } from "./domain";
import { RoundEditionForm } from './ui/component.tsx';
import { EditOrCreateRound } from './command.ts';
import { useNavigate } from 'react-router-dom';
export const SurveillanceRoundsEditor = () => {
    const navigate = useNavigate();
    const [roundEditionData, setRoundEditionData] = useState<RoundEditionData>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const { locationId, roundId } = useParams<{ locationId: string, roundId: string }>();
    useEffect(() => {
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
            {busy ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            ) : (
                roundEditionData && <RoundEditionForm roundEditionData={roundEditionData} onSubmitRequested={submitRound} />
            )}
            {error && <div>Error: {String(error)}</div>}
        </div>

    );
}