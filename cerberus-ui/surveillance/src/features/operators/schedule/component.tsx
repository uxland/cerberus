import { React, useState, useEffect } from 'react';
import { sendMediatorRequest } from '@cerberus/core';
import { ListScheduledRuns } from './query';
import { Box, CircularProgress } from "@mui/material";
import { AcquireRun } from '../../run/acquire/command';
import { isInCourse, ScheduledRunSummary } from "./model.ts";

// Importar los estilos genera conflictos con los estilos de la aplicación principal
// import '@uxland/cerberus-calendar/dist/style.css'

import { Calendar, cerberusTheme } from '@uxland/cerberus-calendar'
import type { CalendarEvent } from '@uxland/cerberus-calendar'

// const darkTheme = createTheme({
//     palette: {
//         mode: "dark",
//         primary: {
//             main: "#ffc200",
//             contrastText: "#ffffff"
//         },
//         secondary: {
//             main: "#505050",
//         },
//         background: {
//             default: "#1f1f1f",
//             paper: "#1f1f1f",
//         },
//         text: {
//             primary: "#ffffff",
//             secondary: "#b0b0b0",
//         },
//         divider: "#3d3d3d",
//         action: {
//             active: "#f38b00",
//             hover: "rgba(243, 139, 0, 0.12)",
//         }
//     },
//     components: {
//         MuiPaper: {
//             styleOverrides: {
//                 root: {
//                     color: "#ffffff !important",
//                     "--Paper-overlay": "none !important",
//                 }
//             }
//         },
//         MuiTableRow: {
//             styleOverrides: {
//                 root: {
//                     "&:hover": {
//                         backgroundColor: "#1f1f1f !important",
//                     }
//                 }
//             }
//         },
//         MuiTableCell: {
//             styleOverrides: {
//                 root: {
//                     borderBottomColor: "#3d3d3d !important",
//                     color: "#ffffff !important",
//                 },
//                 head: {
//                     backgroundColor: "#262626 !important",
//                     color: "#f38b00 !important",
//                     fontWeight: "bold !important",
//                 }
//             }
//         },
//         MuiAppBar: {
//             styleOverrides: {
//                 root: {
//                     backgroundColor: "#1f1f1f !important",
//                 }
//             }
//         },
//         MuiButton: {
//             styleOverrides: {
//                 root: {
//                     color: "#ffffff",
//                     "&:hover": {
//                         backgroundColor: "rgba(243, 139, 0, 0.12)",
//                     }
//                 }
//             }
//         },
//         MuiIconButton: {
//             styleOverrides: {
//                 root: {
//                     color: "#f38b00",
//                     backgroundColor: "#1f1f1f",
//                     border: "none !important",
//                 }
//             }
//         },
//         MuiInputBase: {
//             styleOverrides: {
//                 root: {
//                     color: "#ffffff",
//                 }
//             }
//         },
//         MuiOutlinedInput: {
//             styleOverrides: {
//                 root: {
//                     "& .MuiOutlinedInput-notchedOutline": {
//                         borderColor: "#3d3d3d",
//                     },
//                     "&:hover .MuiOutlinedInput-notchedOutline": {
//                         borderColor: "#f38b00",
//                     },
//                     "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                         borderColor: "#f38b00",
//                     }
//                 }
//             }
//         },
//         MuiDialog: {
//             styleOverrides: {
//                 paper: {
//                     backgroundColor: "#1f1f1f",
//                     color: "#ffffff",
//                 }
//             }
//         },
//         MuiDialogTitle: {
//             styleOverrides: {
//                 root: {
//                     backgroundColor: "#1f1f1f",
//                     color: "#ffffff",
//                 }
//             }
//         },

//     }
// });

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
            start: new Date(2025, 4, 29, 10, 0), // May 29, 2025 10:00 AM
            end: new Date(2025, 4, 29, 11, 0),   // May 29, 2025 11:00 AM
            color: '#3B82F6'
        },
        {
            id: '2',
            title: 'Project Review',
            start: new Date(2025, 4, 30, 14, 0), // May 30, 2025 2:00 PM
            end: new Date(2025, 4, 30, 15, 30),  // May 30, 2025 3:30 PM
            color: '#10B981'
        },
        {
            id: '3',
            title: 'Personal Appointment',
            start: new Date(2025, 4, 31, 9, 0),  // May 31, 2025 9:00 AM
            end: new Date(2025, 4, 31, 10, 0),   // May 31, 2025 10:00 AM
            color: '#F59E0B'
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
                            enableEventCreation: false
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
        // <ThemeProvider theme={darkTheme}>
        //     {busy ? (
        //         <Box display="flex" justifyContent="center" alignItems="center">
        //             <CircularProgress />
        //         </Box>
        //     ) : scheduledRuns ? (
        //         <div className="dark-scheduler" style={{ backgroundColor: "#1f1f1f", padding: "20px", borderRadius: "10px" }}>
        //             <Scheduler
        //                 disableViewNavigator={true}
        //                 agenda={false}
        //                 view="day"
        //                 day={
        //                     {
        //                         startHour: 0,
        //                         endHour: 24,
        //                         step: 60,
        //                         navigation: false
        //                     }
        //                 }
        //                 editable={false}
        //                 events={scheduledRuns}
        //                 selectedDate={new Date()}
        //                 navigation={true}
        //                 onEventClick={(event) => {
        //                     startShceduledRun(event);
        //                 }}
        //             />
        //         </div>
        //     ) : null}
        //     {error && <div>Error: {String(error)}</div>}
        // </ThemeProvider>
    );
};
