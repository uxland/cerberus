import { splitAndChooseDescription } from "@cerberus/shared/src";
import PlayIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import StopIcon from "@mui/icons-material/StopCircleOutlined";
import EyeIcon from "@mui/icons-material/VisibilityOutlined";
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
    Typography,
} from "@mui/material";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useSurveillanceLocales } from "../../../../locales/ca/locales";
import {
    OperationSummary, getOperationUrl
} from "../model";

import { NoData } from "../../../../components/NoData/NoData";

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
    const navigate = useNavigate();
    const handleRowClick = (url) => {
        navigate(url);
    };
    const formatDateString = (dateString) => {
        const date = new Date(dateString);
        return format(date, "dd/MM/yyyy hh:mm:ss a");
    };

    return (
        <TableRow
            key={props.operation.id}
            onClick={() => handleRowClick(getOperationUrl(props.operation))}>
            <TableCell size="small" component="th" scope="row" align="center">
                {props.operation.id}
            </TableCell>
            <TableCell size="small" component="th" scope="row" align="center">
                {props.operation.description}
            </TableCell>
        </TableRow>
    );
};