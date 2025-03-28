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
    Menu,
    MenuItem
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
import { Link } from "react-router-dom";
import EyeIcon from "@mui/icons-material/VisibilityOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";

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

// ...existing code...

const RoundRow = (props: { round: RoundSummary }) => {
    const [busyStart, setBusyStart] = useState<boolean>(false);
    const [busyDelete, setBusyDelete] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleStartRun = async () => {
        handleClose();
        sendMediatorRequest({
            command: new CreateRun(props.round.id),
            setBusy: setBusyStart,
        });
    };

    const handleDeleteRound = async () => {
        handleClose();
        sendMediatorRequest({
            command: new DeleteRound(props.round.id),
            setBusy: setBusyDelete,
        });
    }

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const editUrl = `/surveillance/locations/${props.round.rootLocationId}/rounds/${props.round.id}`;
    const listRunsUrl = `/surveillance/locations/${props.round.rootLocationId}/rounds/${props.round.id}/runs`;

    const menuItems = [
        {
            label: useSurveillanceLocales("round.table.actions.edit"),
            onClick: () => { },
            icon: <EditIcon color="info" fontSize="small" />,
            component: Link,
            to: editUrl,
            disabled: busyStart || busyDelete
        },
        {
            label: useSurveillanceLocales("round.table.actions.start"),
            onClick: handleStartRun,
            icon: busyStart ?
                <CircularProgress size={18} sx={{ color: "#6B7280" }} /> :
                <PlayCircleOutlineIcon color="success" fontSize="small" />,
            disabled: busyStart || busyDelete
        },
        {
            label: useSurveillanceLocales("round.table.actions.delete"),
            onClick: handleDeleteRound,
            icon: busyDelete ?
                <CircularProgress size={18} sx={{ color: "#6B7280" }} /> :
                <DeleteOutlineIcon color="error" fontSize="small" />,
            disabled: busyStart || busyDelete
        },
        {
            label: useSurveillanceLocales("round.table.actions.view"),
            onClick: () => { },
            icon: <EyeIcon sx={{ color: "#9c27b0" }} fontSize="small" />,
            component: Link,
            to: listRunsUrl,
            disabled: busyStart || busyDelete
        }
    ];

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
            <TableCell align="center" width={100}>
                <IconButton
                    aria-label="more"
                    id="round-actions-button"
                    aria-controls={open ? "round-actions-menu" : undefined}
                    aria-expanded={open ? "true" : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    <MoreVertIcon sx={{ color: "#d1d5db" }} />
                </IconButton>
                <Menu
                    id="round-actions-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        "aria-labelledby": "round-actions-button",
                    }}
                    PaperProps={{
                        elevation: 3,
                        sx: {
                            mt: 1,
                            borderRadius: '8px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                        }
                    }}
                >
                    {menuItems.map((item, index) => (
                        <MenuItem
                            key={index}
                            component={item.component || 'li'}
                            to={item.to}
                            disabled={item.disabled}
                            onClick={() => {
                                if (item.onClick) item.onClick();
                                if (!item.component) handleClose();
                            }}
                            sx={{
                                gap: 2,
                                minWidth: '200px',
                                py: 1.2,
                                px: 2,
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                },
                                '& .MuiSvgIcon-root': {
                                    fontSize: '20px'
                                }
                            }}
                        >
                            {item.icon}
                            <span style={{ fontWeight: 500 }}>{item.label}</span>
                        </MenuItem>
                    ))}
                </Menu>
            </TableCell>
        </TableRow>
    );
};