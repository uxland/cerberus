import { React, useEffect, useState } from 'react';
import { sendMediatorRequest } from '@cerberus/core';
import { ListRuns } from './query';
import { Box, CircularProgress } from "@mui/material";
import { Link, useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import { RunCard } from './ui/runCard';

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

    useEffect(() => {
        console.log(runs);
    }, [runs]);



    return (
        <>
            {busy ? (
                <Box className="flex justify-center items-center">
                    <CircularProgress />
                </Box>
            ) : runs ? (
                <div className='space-y-4'>
                    <div className="flex items-center gap-2 bg-tableBg py-3 px-6 rounded-[10px] w-full flex-shrink-0">
                        <Typography className="uppercase !text-primary !font-semibold">{roundId}</Typography>
                    </div>
                    <div className="flex flex-col gap-2 bg-tableBg py-3 px-6 rounded-[10px] w-full flex-shrink-0 space-y-4">
                        <Typography className="!font-semibold">Llistat</Typography>
                        <div className="space-y-4">
                            {runs.map((run) => (
                                <Link
                                    to={`/surveillance/locations/${locationId}/rounds/${roundId}/runs/${run.id}`}
                                    key={run.id}
                                    className="block no-underline cursor-pointer"
                                >
                                    <RunCard key={run.id} {...run} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            ) : null}
            {error && <div>Error: {String(error)}</div>}
        </>
    );
};