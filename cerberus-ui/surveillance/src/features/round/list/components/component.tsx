import { splitAndChooseDescription } from "@cerberus/shared/src";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
} from "@mui/material";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { RoundSummary, getRoundUrl } from "../model";
import { useSurveillanceLocales } from "../../../../locales/ca/locales";
import { NoData } from "../../../../components/NoData/NoData";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

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
                                    {useSurveillanceLocales("round.table.actions")}
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
    const navigate = useNavigate();

    const handleStartRun = async () => {
        try {
            const response = await fetch(`/api/rounds/${props.round.id}/run`, {
                method: 'POST',
            });

            if (!response.ok) throw new Error('Failed to start run');

            const data = await response.json();
            console.log('Run started:', data);
            navigate(data.url);

        } catch (error) {
            console.error('Error starting run:', error);
        }
    };

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
                <IconButton onClick={handleStartRun}>
                    <PlayCircleOutlineIcon color="success" />
                </IconButton>
                <IconButton>
                    <DeleteOutlineIcon color="error" />
                </IconButton>
            </TableCell>
        </TableRow>
    );
};