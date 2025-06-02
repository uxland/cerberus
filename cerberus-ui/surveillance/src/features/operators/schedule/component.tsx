import { React, useState, useEffect } from 'react';
import { Scheduler } from '@aldabil/react-scheduler';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { sendMediatorRequest } from '@cerberus/core';
import { ListScheduledRuns } from './query';
import { Box, CircularProgress } from "@mui/material";
import { AcquireRun } from '../../run/acquire/command';
import { isInCourse, ScheduledRunSummary } from "./model.ts";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#ffc200",
            contrastText: "#ffffff"
        },
        secondary: {
            main: "#505050",
        },
        background: {
            default: "#1f1f1f",
            paper: "#1f1f1f",
        },
        text: {
            primary: "#ffffff",
            secondary: "#b0b0b0",
        },
        divider: "#3d3d3d",
        action: {
            active: "#f38b00",
            hover: "rgba(243, 139, 0, 0.12)",
        }
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    color: "#ffffff !important",
                    "--Paper-overlay": "none !important",
                }
            }
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    "&:hover": {
                        backgroundColor: "#1f1f1f !important",
                    }
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottomColor: "#3d3d3d !important",
                    color: "#ffffff !important",
                },
                head: {
                    backgroundColor: "#262626 !important",
                    color: "#f38b00 !important",
                    fontWeight: "bold !important",
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "#1f1f1f !important",
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    color: "#ffffff",
                    "&:hover": {
                        backgroundColor: "rgba(243, 139, 0, 0.12)",
                    }
                }
            }
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: "#f38b00",
                    backgroundColor: "#1f1f1f",
                    border: "none !important",
                }
            }
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    color: "#ffffff",
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#3d3d3d",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#f38b00",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#f38b00",
                    }
                }
            }
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    backgroundColor: "#1f1f1f",
                    color: "#ffffff",
                }
            }
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    backgroundColor: "#1f1f1f",
                    color: "#ffffff",
                }
            }
        },

    }
});

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
    return (
        <ThemeProvider theme={darkTheme}>
            {busy ? (
                <Box display="flex" justifyContent="center" alignItems="center">
                    <CircularProgress />
                </Box>
            ) : scheduledRuns ? (
                <div className="dark-scheduler" style={{ backgroundColor: "#1f1f1f", padding: "20px", borderRadius: "10px" }}>
                    <Scheduler
                        disableViewNavigator={true}
                        agenda={false}
                        view="day"
                        day={
                            {
                                startHour: 0,
                                endHour: 24,
                                step: 60,
                                navigation: false
                            }
                        }
                        editable={false}
                        events={scheduledRuns}
                        selectedDate={new Date()}
                        navigation={true}
                        onEventClick={(event) => {
                            startShceduledRun(event);
                        }}
                    />
                </div>
            ) : null}
            {error && <div>Error: {String(error)}</div>}
        </ThemeProvider>
    );
};
