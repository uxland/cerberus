import React, { useEffect, useState } from 'react';
import { ErrorView, sendMediatorRequest } from '@cerberus/core';
import { Box, CircularProgress, Typography } from "@mui/material";
import { Link } from 'react-router-dom';
import { RunCard } from '../ui/runCard';
import { NoData } from '../ui/noData';
import { useSurveillanceLocales } from '../../../../locales/ca/locales';
import { AxiosError } from 'axios';

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
    const error403 = useSurveillanceLocales("run.errors.list.403");
    const error500 = useSurveillanceLocales("run.errors.list.500");

    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<AxiosError>(undefined);
    const [runs, setRuns] = useState(undefined);

    const fetchRuns = () => {
        setError(undefined);
        sendMediatorRequest({
            command,
            setBusy: setBusy,
            setError: setError,
            setState: setRuns,
        });
    };

    useEffect(() => {
        if (command) {
            fetchRuns();
        }
    }, [command]);

    if (error) {
        return (
            <ErrorView
                error={error}
                onRefresh={fetchRuns}
                customMessages={{
                    403: error403,
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
            ) : runs && runs.length > 0 ? (
                <div className="space-y-4">
                    {headerContent && headerContent}

                    <div className="flex flex-col gap-2 bg-tableBg p-6 rounded-[10px] w-full flex-shrink-0 space-y-4">
                        {title && <Typography className="!font-semibold">{title}</Typography>}
                        <div className="space-y-4">
                            {runs.map((run) => (
                                <Link
                                    to={`/surveillance/locations/${run.locationId}/rounds/${run.roundId}/runs/${run.id}`}
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
        </>
    );
};