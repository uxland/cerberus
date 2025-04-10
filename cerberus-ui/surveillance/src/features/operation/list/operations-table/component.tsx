import {
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    CircularProgress,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useNavigate } from "react-router-dom";
import { useSurveillanceLocales } from "../../../../locales/ca/locales";
import {
    OperationSummary, getOperationUrl
} from "../model";
import { NoData } from "../../../../components/NoData/NoData";
import { sendMediatorRequest } from "@cerberus/core";
import { DeleteOperation } from "../../delete/command";
import { useState } from "react";

export const OperationsTable = (props: { operations: OperationSummary[] }) => {
    return (
        <div className="flex flex-col gap-4">
            <Paper
                className="custom-table"
                sx={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "538px",
                    overflow: `${props.operations.length === 0 ? "hidden" : "auto"}`,
                }}>
                <TableContainer component={Paper} className="custom-table p-2">
                    <Table sx={{ minWidth: 450 }} aria-label="simple table">
                        <TableHead>
                            <TableRow className="font-semibold">
                                <TableCell align="center" className="table-head">
                                    {useSurveillanceLocales("operation.table.id")}
                                </TableCell>
                                <TableCell align="center" className="table-head">
                                    {useSurveillanceLocales("operation.table.description")}
                                </TableCell>
                                <TableCell align="center" className="table-head">
                                    {useSurveillanceLocales("operation.table.actions.title")}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        {props.operations.length === 0 ? (
                            <TableBody sx={{ position: "relative", height: "500px" }}>
                                <NoData />
                            </TableBody>
                        ) : (
                            <TableBody className="h-420">
                                {props.operations.map((row) => (
                                    <OpetationRow operation={row} key={row.id} />
                                ))}
                            </TableBody>
                        )}
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    );
};

const OpetationRow = (props: { operation: OperationSummary }) => {
    const [busyEdit, setBusyEdit] = useState<boolean>(false);
    const [busyDelete, setBusyDelete] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleRowClick = (url) => {
        setBusyEdit(true);
        try {
            navigate(url);
        } finally {
            setBusyEdit(false);
        }
    };

    const handleDeleteOperation = async () => {
        sendMediatorRequest({
            command: new DeleteOperation(props.operation.id),
            setBusy: setBusyDelete,
        })
    };

    return (
        <TableRow key={props.operation.id}>
            <TableCell size="small" component="th" scope="row" align="center">
                {props.operation.id}
            </TableCell>
            <TableCell size="small" component="th" scope="row" align="center">
                {props.operation.description}
            </TableCell>
            <TableCell align="center" className="flex justify-center gap-2">
                <Tooltip title={useSurveillanceLocales("operation.table.actions.edit")}>
                    <IconButton
                        onClick={() => handleRowClick(getOperationUrl(props.operation))}
                        disabled={busyEdit || busyDelete}
                    >
                        {busyEdit ? (
                            <CircularProgress size={24} color="info" />
                        ) : (
                            <EditIcon color="info" />
                        )}
                    </IconButton>
                </Tooltip>
                <Tooltip title={useSurveillanceLocales("operation.table.actions.delete")}>
                    <IconButton
                        onClick={handleDeleteOperation}
                        disabled={busyEdit || busyDelete}
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