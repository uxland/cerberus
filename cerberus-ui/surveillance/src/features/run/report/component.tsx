import { React, useEffect, useState } from 'react';
import { sendMediatorRequest } from '@cerberus/core';
import { GetRun } from '../execution/query';
import { Box, CircularProgress } from "@mui/material";
import { useParams } from 'react-router-dom';
import { RunReport } from './ui/report';
import { ErrorView } from '@cerberus/core';
import { useSurveillanceLocales } from '../../../locales/ca/locales.ts';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

export const RunReportView = () => {
    const error403 = useSurveillanceLocales("run.errors.report.403");
    const error500 = useSurveillanceLocales("run.errors.report.500");
    const error404 = useSurveillanceLocales("run.errors.report.404");

    const { roundId, locationId, runId } = useParams();
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<AxiosError>(undefined);
    const [run, setRun] = useState(null);
    const navigate = useNavigate();

    const fetchRun = () => {
        setError(undefined);
        sendMediatorRequest({
            command: new GetRun(runId),
            setBusy: setBusy,
            setError: setError,
            setState: setRun
        });
    };

    useEffect(() => {
        if (roundId && locationId && runId) {
            fetchRun();
        }
    }, [roundId, locationId, runId]);

    if (error) {
        return (
            <ErrorView
                error={error}
                onRefresh={fetchRun}
                onGoBack={() => navigate("/surveillance/runs")}
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
            ) : run ? (
                <RunReport run={run} />
            ) : null}
        </>
    );
};