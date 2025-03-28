import { React, useState, useEffect } from 'react';
import { Scheduler } from '@aldabil/react-scheduler';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { sendMediatorRequest } from '@cerberus/core';
import { ListScheduledRuns } from './query';
import { Box, CircularProgress } from "@mui/material";

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

    const events = [
        {
            event_id: 1,
            title: "Ronda de supervisión 1",
            start: new Date(new Date().setHours(9, 0, 0, 0)),
            end: new Date(new Date().setHours(10, 0, 0, 0)),
            color: "#f38b00",
            editable: false,
            deletable: false,
            sx: {
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                '&:hover': {
                    backgroundColor: "#2a2a2a",
                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
                }
            }
        },
        {
            event_id: 2,
            color: "#f38b00",
            title: "Ronda de supervisión 2",
            start: new Date(new Date().setHours(14, 0, 0, 0)),
            end: new Date(new Date().setHours(15, 0, 0, 0)),
            sx: {
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                '&:hover': {
                    backgroundColor: "#2a2a2a",
                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
                }
            }
        },
        {
            event_id: 3,
            title: "Ronda de supervisión 3",
            start: new Date(new Date().setHours(14, 0, 0, 0)),
            end: new Date(new Date().setHours(15, 0, 0, 0)),
            sx: {
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                '&:hover': {
                    backgroundColor: "#2a2a2a",
                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
                }
            }
        },
        {
            event_id: 4,
            title: "Ronda de supervisión 4",
            start: new Date(new Date().setHours(13, 0, 0, 0)),
            end: new Date(new Date().setHours(15, 0, 0, 0)),
            sx: {
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                '&:hover': {
                    backgroundColor: "#2a2a2a",
                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
                }
            }
        },
    ];

    return (
        <ThemeProvider theme={darkTheme}>
            {busy ? (
                <Box display="flex" justifyContent="center" alignItems="center">
                    <CircularProgress />
                </Box>
            ) : events ? (
                <div className="dark-scheduler" style={{ backgroundColor: "#1f1f1f", padding: "20px", borderRadius: "10px" }}>
                    <Scheduler
                        disableViewNavigator={true}
                        agenda={false}
                        view="day"
                        editable={false}
                        events={events}
                        selectedDate={new Date()}
                        navigation={true}
                    />
                </div>
            ) : null}
            {error && <div>Error: {String(error)}</div>}
        </ThemeProvider>
    );
};
