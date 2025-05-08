import { React, useEffect, useState } from 'react';
import { sendMediatorRequest } from '@cerberus/core';
import { GetRun } from '../execution/query';
import { Box, CircularProgress } from "@mui/material";
import { useParams } from 'react-router-dom';
import { RunReport } from './ui/report';

export const RunReportView = () => {
    const { roundId, locationId, runId } = useParams();
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    const [run, setRun] = useState(null);

    useEffect(() => {
        if (roundId && locationId && runId) {
            sendMediatorRequest({
                command: new GetRun(runId),
                setBusy: setBusy,
                setError: setError,
                setState: setRun
            });
        }
    }, [roundId, locationId, runId]);

    useEffect(() => {
        console.log(run);
    }, [run]);



    return (
        <>
            {busy ? (
                <Box className="flex justify-center items-center">
                    <CircularProgress />
                </Box>
            ) : run ? (
                <div >
                    <RunReport run={run} />
                </div>
            ) : null}
            {error && <div>Error: {String(error)}</div>}
        </>
    );
};