import React, { useState, useEffect } from 'react';
import { CircularProgress, Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { RoundEditionData } from "./domain";
import { GetRoundEditionData } from "./get-round-edition-data.ts";
import { ErrorView, nop } from "@cerberus/core";
import { Round } from "./domain";
import { RoundEditionForm } from './ui/component.tsx';
import { EditOrCreateRound } from './command.ts';
import { sendMediatorRequest } from '@cerberus/core';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useSurveillanceLocales } from '../../../locales/ca/locales.ts';

export const SurveillanceRoundsEditor = () => {
    const error403 = useSurveillanceLocales("round.errors.403");
    const error404 = useSurveillanceLocales("round.errors.404");
    const error500 = useSurveillanceLocales("round.errors.500");

    const [roundEditionData, setRoundEditionData] = useState<RoundEditionData>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<AxiosError>(undefined);
    const { locationId, roundId } = useParams<{ locationId: string, roundId: string }>();
    const navigate = useNavigate();


    const fetchRoundData = async () => {
        await sendMediatorRequest({
            command: new GetRoundEditionData(locationId, roundId),
            setBusy: setBusy,
            setError: setError,
            setState: setRoundEditionData
        });
    }

    useEffect(() => {
        fetchRoundData().then(nop)
    }, [locationId, roundId]);

    useEffect(() => {
        if (roundEditionData) {
            console.log("Round data updated:", roundEditionData);
        }
    }, [roundEditionData]);

    const submitRound = async (round: Round) => {
        const command = new EditOrCreateRound(roundId === "new" ? undefined : roundId, round);
        await sendMediatorRequest({
            command: command,
            setBusy: setBusy,
            setError: setError,
        })
    }

    if (error) {
        return (
            <ErrorView
                error={error}
                onRefresh={fetchRoundData}
                onGoBack={() => navigate("/locations/" + locationId + "?item-type=Location&tab=2")}
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
                roundEditionData && <RoundEditionForm roundEditionData={roundEditionData} onSubmitRequested={submitRound} />
            )}
        </>

    );
}