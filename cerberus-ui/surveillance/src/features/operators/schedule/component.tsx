import React, { useState, useEffect } from 'react';
import { ErrorView, sendMediatorRequest } from '@cerberus/core';
import { ListScheduledRuns } from './query';
import { Box, CircularProgress } from "@mui/material";
import { AcquireRun } from '../../run/acquire/command';
import { isInCourse, ScheduledRunSummary, SchedulerEvent, RunStatus } from "./model.ts";
import { useSurveillanceLocales } from '../../../locales/ca/locales.ts';
import { AxiosError } from 'axios';
import { Calendar, cerberusTheme } from './scheduler-component/index.ts';
import type { CalendarEvent } from './scheduler-component/types/calendar.ts';

export const ScheduledRunsView = () => {
    const error403 = useSurveillanceLocales("operators.schedule.errors.403");
    const error500 = useSurveillanceLocales("operators.schedule.errors.500");

    const [scheduledRuns, setScheduledRuns] = useState<SchedulerEvent[]>([]);
    const [busy, setBusy] = useState(true);
    const [error, setError] = useState<AxiosError>(undefined);

    const fetchScheduledRuns = () => {
        setError(undefined);
        sendMediatorRequest({
            command: new ListScheduledRuns(),
            setBusy: setBusy,
            setError: setError,
            setState: setScheduledRuns
        });
    }
    useEffect(() => {
        fetchScheduledRuns();
    }, []);

    useEffect(() => {
        console.log("scheduler", scheduledRuns);
    }, [scheduledRuns]);

    const startShceduledRun = (event: any) => {
        const run: ScheduledRunSummary = event.run;

        if (run.status === RunStatus.Completed) {
            console.log('Cannot start completed run:', run);
            return Promise.resolve();
        }

        if (!isInCourse(run)) return Promise.resolve();
        sendMediatorRequest({
            command: new AcquireRun(run.id, run.description, run.roundId),
            setBusy: setBusy,
            setError: setError,
        })
    };

    if (error) {
        return (
            <ErrorView
                error={error}
                onRefresh={fetchScheduledRuns}
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
            ) : (
                <div style={{ height: "100%", width: "100%", padding: '20px' }}>
                    <Calendar
                        events={scheduledRuns}
                        view="day"
                        config={{
                            theme: cerberusTheme,
                            enableEventCreation: false,
                            startHour: 7,
                            endHour: 22,
                        }}
                        onEventClick={(event: CalendarEvent) => {
                            console.log('Event clicked:', event);
                            startShceduledRun(event);
                        }}
                    />
                </div>
            )}
        </>
    );
};
