import { React, useEffect, useState } from 'react';
import { sendMediatorRequest } from '@cerberus/core';
import { ListRuns } from './query';
import { Box, CircularProgress } from "@mui/material";
import { useParams } from 'react-router-dom';

export const RunSummaryView = () => {
    const { roundId, locationId } = useParams();
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    const [runs, setRuns] = useState([]);

    useEffect(() => {
        if (roundId && locationId) {
            sendMediatorRequest({
                command: new ListRuns(roundId, locationId),
                setBusy: setBusy,
                setError: setError,
                setState: setRuns,
            });
        }
    }, [roundId, locationId]);

    return (
        <>
            {busy ? (
                <Box className="flex justify-center items-center">
                    <CircularProgress />
                </Box>
            ) : runs ? (
                <div>
                    <h1>Run Summary</h1>
                    <ul>
                        {runs.map((run) => (
                            <li key={run.id}>{run.id}</li>
                        ))}
                    </ul>
                </div>
            ) : null}
            {error && <div>Error: {String(error)}</div>}
        </>
    );
};


