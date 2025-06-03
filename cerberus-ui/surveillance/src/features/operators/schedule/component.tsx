import React, { useState, useEffect } from 'react';
import { sendMediatorRequest } from '@cerberus/core';
import { ListScheduledRuns } from './query';
import { Box, CircularProgress } from "@mui/material";
import { AcquireRun } from '../../run/acquire/command';
import { isInCourse, ScheduledRunSummary } from "./model.ts";

// Import the local scheduler component instead of external library
// import Scheduler from '@cerberus/core/src/presentation/components/uxland-cerberus-scheduler-component/Scheduler'
// import { cerberusTheme } from '@cerberus/core/src/presentation/components/uxland-cerberus-scheduler-component/themes/cerberus'
// import type { CalendarEvent } from '@cerberus/core/src/presentation/components/uxland-cerberus-scheduler-component/types/calendar'

// Using external library 
// import '@angeluxee/cerberus-calendar/dist/style.css'
// import { Calendar, cerberusTheme } from '@angeluxee/cerberus-calendar'
// import type { CalendarEvent } from '@angeluxee/cerberus-calendar'
import {Calendar, cerberusTheme} from './scheduler-component/index.ts';
import type { CalendarEvent } from './scheduler-component/types/calendar.ts';
export const ScheduledRunsView = () => {
    const [scheduledRuns, setScheduledRuns] = useState([]);
    const [busy, setBusy] = useState(true);
    const [error, setError] = useState(undefined);

    useEffect(() => {
        sendMediatorRequest({
            command: new ListScheduledRuns(),
            setBusy: setBusy,
            setError: setError,
            setState: setScheduledRuns
        });
    }, []);
    useEffect(() => {
        console.log("scheduler", scheduledRuns);
    }, [scheduledRuns]);


    const startShceduledRun = (event: any) => {
        const run: ScheduledRunSummary = event.run;
        if (!isInCourse(run)) return Promise.resolve();
        sendMediatorRequest({
            command: new AcquireRun(run.id, run.description, run.roundId),
            setBusy: setBusy,
            setError: setError,
        })
    };

    const sampleEvents: CalendarEvent[] = [
        {
            id: '1',
            title: 'Team Meeting',
            start: new Date(2025, 5, 2, 9, 0),   // June 2, 2025 9:00 AM
            end: new Date(2025, 5, 2, 10, 30),   // June 2, 2025 10:30 AM (1.5 hours)
            backgroundColor: '#EF4444'
        },
        {
            id: '2',
            title: 'Project Review',
            start: new Date(2025, 5, 2, 10, 0),  // June 2, 2025 10:00 AM (overlaps with Team Meeting)
            end: new Date(2025, 5, 2, 11, 30),   // June 2, 2025 11:30 AM (1.5 hours)
            backgroundColor: '#F97315'
        },
        {
            id: '3',
            title: 'Personal Appointment',
            start: new Date(2025, 5, 2, 8, 0),   // June 2, 2025 8:00 AM
            end: new Date(2025, 5, 2, 9, 30),    // June 2, 2025 9:30 AM (1.5 hours)
            backgroundColor: '#F59E0B'
        },
        {
            id: '4',
            title: 'Client Call',
            start: new Date(2025, 5, 2, 14, 0),  // June 2, 2025 2:00 PM
            end: new Date(2025, 5, 2, 15, 30),   // June 2, 2025 3:30 PM (1.5 hours)
            backgroundColor: '#10B981'
        },
        {
            id: '5',
            title: 'Code Review',
            start: new Date(2025, 5, 2, 11, 0),  // June 2, 2025 11:00 AM
            end: new Date(2025, 5, 2, 12, 30),   // June 2, 2025 12:30 PM (1.5 hours)
            backgroundColor: '#8B5CF6'
        },
        {
            id: '6',
            title: 'Lunch Break',
            start: new Date(2025, 5, 2, 12, 0),  // June 2, 2025 12:00 PM (overlaps with Code Review)
            end: new Date(2025, 5, 2, 13, 0),    // June 2, 2025 1:00 PM (1 hour)
            backgroundColor: '#EC4899'
        },
        {
            id: '7',
            title: 'Sprint Planning',
            start: new Date(2025, 5, 2, 15, 30), // June 2, 2025 3:30 PM
            end: new Date(2025, 5, 2, 17, 0),    // June 2, 2025 5:00 PM (1.5 hours)
            backgroundColor: '#06B6D4'
        },
        {
            id: '8',
            title: 'Bug Fixing Session',
            start: new Date(2025, 5, 2, 16, 0),  // June 2, 2025 4:00 PM (overlaps with Sprint Planning)
            end: new Date(2025, 5, 2, 18, 0),    // June 2, 2025 6:00 PM (2 hours)
            backgroundColor: '#84CC16'
        },
        {
            id: '9',
            title: 'Daily Standup',
            start: new Date(2025, 5, 2, 7, 30),  // June 2, 2025 7:30 AM
            end: new Date(2025, 5, 2, 8, 30),    // June 2, 2025 8:30 AM (1 hour)
            backgroundColor: '#F472B6'
        },
        {
            id: '10',
            title: 'Documentation Review',
            start: new Date(2025, 5, 2, 13, 30), // June 2, 2025 1:30 PM
            end: new Date(2025, 5, 2, 15, 0),    // June 2, 2025 3:00 PM (1.5 hours, overlaps with Client Call)
            backgroundColor: '#6366F1'
        },
        {
            id: '11',
            title: 'Team Retrospective',
            start: new Date(2025, 5, 2, 17, 30), // June 2, 2025 5:30 PM
            end: new Date(2025, 5, 2, 19, 0),    // June 2, 2025 7:00 PM (1.5 hours)
            backgroundColor: '#14B8A6'
        },
        {
            id: '12',
            title: 'Coffee Break',
            start: new Date(2025, 5, 2, 10, 45), // June 2, 2025 10:45 AM
            end: new Date(2025, 5, 2, 11, 45),   // June 2, 2025 11:45 AM (1 hour)
            backgroundColor: '#A855F7'
        }
    ];

    return (
        <>
            {busy ? (
                <Box display="flex" justifyContent="center" alignItems="center">
                    <CircularProgress />
                </Box>
            ) : scheduledRuns ? (
                <div style={{ height: "765px", width: "1200px", padding: '20px' }}>
                    <Calendar
                        events={sampleEvents}
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
            ) : null}
            {error && <div>Error: {String(error)}</div>}
        </>
    );
};
