import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    CircularProgress,
    Tooltip,
} from "@mui/material";
import { RoundSummary } from "../model";
import { useSurveillanceLocales } from "../../../../locales/ca/locales";
import { NoData } from "../../../../components/NoData/NoData";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { CreateRun } from "../../../run/create/command";
import { useState } from "react";
import { sendMediatorRequest } from "@cerberus/core";
import { DeleteRound } from "../../delete/command";
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from "react-router-dom";

export const RoundsTable = (props: { rounds: RoundSummary[] }) => {
    return (
        <div className="flex flex-col gap-4">
            <Paper
                className="custom-table"
                sx={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "538px",
                    overflow: `${props.rounds.length === 0 ? "hidden" : "auto"}`,
                }}>
                <TableContainer component={Paper} className="custom-table p-2">
                    <Table sx={{ minWidth: 450 }} aria-label="simple table">
                        <TableHead>
                            <TableRow className="font-semibold">
                                <TableCell align="center" className="table-head">
                                    {useSurveillanceLocales("round.table.id")}
                                </TableCell>
                                <TableCell align="center" className="table-head">
                                    {useSurveillanceLocales("round.table.description")}
                                </TableCell>
                                <TableCell align="center" className="table-head">
                                    {useSurveillanceLocales("round.table.assignedTo")}
                                </TableCell>
                                <TableCell align="center" className="table-head">
                                    {useSurveillanceLocales("round.table.cronExpression")}
                                </TableCell>
                                <TableCell align="center" className="table-head">
                                    {useSurveillanceLocales("round.table.actions.title")}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        {props.rounds.length === 0 ? (
                            <TableBody sx={{ position: "relative", height: "500px" }}>
                                <NoData />
                            </TableBody>
                        ) : (
                            <TableBody className="h-420">
                                {props.rounds.map((row) => (
                                    <RoundRow round={row} key={row.id} />
                                ))}
                            </TableBody>
                        )}
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    );
};

const RoundRow = (props: { round: RoundSummary }) => {
    const [busyEdit, setBusyEdit] = useState<boolean>(false);
    const [busyStart, setBusyStart] = useState<boolean>(false);
    const [busyDelete, setBusyDelete] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleStartRun = async () => {
        sendMediatorRequest({
            command: new CreateRun(props.round.id),
            setBusy: setBusyStart,
        });
    };

    const handleDeleteRound = async () => {
        sendMediatorRequest({
            command: new DeleteRound(props.round.id),
            setBusy: setBusyDelete,
        });
    }

    const handleEditRound = async () => {
        setBusyEdit(true);
        try {
            navigate(`/surveillance/locations/${props.round.rootLocationId}/rounds/${props.round.id}`);
        } finally {
            setBusyEdit(false);
        }
    }

    return (
        <TableRow>
            <TableCell size="small" component="th" scope="row" align="center">
                {props.round.id}
            </TableCell>
            <TableCell size="small" component="th" scope="row" align="center">
                {props.round.description}
            </TableCell>
            <TableCell size="small" component="th" scope="row" align="center">
                {props.round.assignedTo}
            </TableCell>
            <TableCell size="small" component="th" scope="row" align="center">
                {props.round.cronExpression}
            </TableCell>
            <TableCell align="center" width={200} className="flex justify-center gap-1">
                <Tooltip title={useSurveillanceLocales("round.table.actions.edit")}>
                    <IconButton
                        onClick={handleEditRound}
                        disabled={busyEdit || busyStart || busyDelete}
                    >
                        {busyEdit ? (
                            <CircularProgress size={24} color="info" />
                        ) : (
                            <EditIcon color="info" />
                        )}
                    </IconButton>
                </Tooltip>
                <Tooltip title={useSurveillanceLocales("round.table.actions.start")}>
                    <IconButton
                        onClick={handleStartRun}
                        disabled={busyEdit || busyStart || busyDelete}
                    >
                        {busyStart ? (
                            <CircularProgress size={24} color="success" />
                        ) : (
                            <PlayCircleOutlineIcon color="success" />
                        )}
                    </IconButton>
                </Tooltip>
                <Tooltip title={useSurveillanceLocales("round.table.actions.delete")}>
                    <IconButton
                        onClick={handleDeleteRound}
                        disabled={busyEdit || busyStart || busyDelete}
                    >
                        {busyDelete ? (
                            <CircularProgress size={24} color="error" />
                        ) : (
                            <DeleteOutlineIcon color="error" />
                        )}
                    </IconButton>
                </Tooltip>
            </TableCell>
        </TableRow>
    );
};