import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { RoundEditionData } from "./domain";
import { Mediator } from "mediatr-ts";
import { GetRoundEditionData } from "./get-round-edition-data.ts";
import { nop } from "@cerberus/core";
import { RoundEditionForm } from './ui/component.tsx';
export const SurveillanceRoundsEditor = () => {

    const [roundEditionData, setRoundEditionData] = useState<RoundEditionData>(null);
    const [isBusy, setIsBusy] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const { locationId, roundId } = useParams<{ locationId: string, roundId: string }>();
    useEffect(() => {
        // const cameras = new Mediator().send(new ListCaptureCameras());
        async function fetchRoundData() {
            new Mediator().send(new GetRoundEditionData(locationId, roundId, setRoundEditionData, setIsBusy, setError));
        }
        fetchRoundData().then(nop);
    }, [locationId, roundId]);

    return (
        <div>
            {isBusy && <div>Busy</div>}
            {roundEditionData && <RoundEditionForm roundEditionData={roundEditionData} />}
            {error && <div>Error: {String(error)}</div>}
        </div>

    );
}