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
    const [busy, setBusy] = useState<boolean>(false);

    const handleStartRun = async () => {
        // const request = await new Mediator().send(new CreateRun(props.round.id, setBusy));
        // console.log("request", props.round.id);
        sendMediatorRequest({
            command: new CreateRun(props.round.id),
            setBusy: setBusy,
        });
    };
    const handleDeleteRound = async () => {
        sendMediatorRequest({
            command: new DeleteRound(props.round.id),
            setBusy: setBusy,
        });
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
            <TableCell align="center" width={200} className="flex">
                <Tooltip title={useSurveillanceLocales("round.table.actions.start")}>
                    <IconButton
                        onClick={handleStartRun}
                        disabled={busy}
                    >
                        {busy ? (
                            <CircularProgress size={24} color="success" />

                        ) : (
                            <PlayCircleOutlineIcon color="success" />
                        )}
                    </IconButton>
                </Tooltip>
                <Tooltip title={useSurveillanceLocales("round.table.actions.delete")}>
                    <IconButton onClick={handleDeleteRound}>
                        {busy ? (
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