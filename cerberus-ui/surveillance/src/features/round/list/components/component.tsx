import { splitAndChooseDescription } from "@cerberus/shared/src";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { RoundSummary, getRoundUrl } from "../model";

import { NoData } from "../../../../components/NoData/NoData";

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
                                    id
                                </TableCell>
                                <TableCell align="center" className="table-head">
                                    Description
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

const OpetationRow = (props: { operation: RoundSummary }) => {
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
            onClick={() => handleRowClick(getRoundUrl(props.operation))}>
            <TableCell size="small" component="th" scope="row" align="center">
                {props.operation.id}
            </TableCell>
            <TableCell
                align="center"
                component="th"
                scope="row">{`${splitAndChooseDescription(
                    props.operation.description,
                    "first"
                )}`}</TableCell>
        </TableRow>
    );
};