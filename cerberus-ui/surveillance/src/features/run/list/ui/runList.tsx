import React, { useEffect, useState } from 'react';
import { sendMediatorRequest } from '@cerberus/core';
import { Box, CircularProgress, Typography } from "@mui/material";
import { Link } from 'react-router-dom';
import { RunCard } from '../ui/runCard';
import { NoData } from '../ui/noData';

type RunsListProps = {
    command: any;
    title?: string;
    headerContent?: React.ReactNode;
};

export const RunsList = ({
    command,
    title,
    headerContent,
}: RunsListProps) => {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    const [runs, setRuns] = useState([]);

    useEffect(() => {
        if (command) {
            sendMediatorRequest({
                command,
                setBusy: setBusy,
                setError: setError,
                setState: setRuns,
            });
        }
    }, [command]);


    useEffect(() => {
        console.log(runs);
    }, [runs]);
    return (
        <>
            {busy ? (
                <Box className="flex justify-center items-center h-40">
                    <CircularProgress />
                </Box>
            ) : runs && runs.length > 0 ? (
                <div className="space-y-4">
                    {headerContent && headerContent}

                    <div className="flex flex-col gap-2 bg-tableBg p-6 rounded-[10px] w-full flex-shrink-0 space-y-4">
                        {title && <Typography className="!font-semibold">{title}</Typography>}
                        <div className="space-y-4">
                            {runs.map((run) => (
                                <Link
                                    to={`/surveillance/locations/${run.rootLocationId}/rounds/${run.roundId}/runs/${run.id}`}
                                    key={run.id}
                                    className="block no-underline cursor-pointer"
                                >
                                    <RunCard key={run.id} {...run} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <NoData />
            )}
            {error && <div className="mt-4 text-red-600">Error: {String(error)}</div>}
        </>
    );
};