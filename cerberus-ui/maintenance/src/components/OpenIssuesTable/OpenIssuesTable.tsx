import {splitAndChooseDescription} from "@cerberus/shared/src";
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
import {format} from "date-fns";
import {useNavigate} from "react-router-dom";
import {
  MaintenanceIssueSummary,
  getIssueUrl,
} from "../../features/issues/list-open-issues/model";
import {MaintenanceIssueStatus} from "../../features/issues/model";
import {useMaintenanceLocales} from "../../locales/ca/locales";
import {NoData} from "../NoData/NoData";

export const OpenIssuesTable = (props: {issues: MaintenanceIssueSummary[]}) => {
  return (
    <div className="flex flex-col gap-4">
      <Typography variant="h5" className="pl-6">
        {useMaintenanceLocales("title.openIssues")} ({props.issues.length})
      </Typography>
      <Paper
        className="custom-table"
        sx={{
          width: "100%",
          height: "auto",
          maxHeight: "538px",
          overflow: `${props.issues.length === 0 ? "hidden" : "auto"}`,
        }}>
        <TableContainer component={Paper} className="custom-table">
          <Table sx={{minWidth: 450}} aria-label="simple table">
            <TableHead>
              <TableRow className="font-semibold">
                <TableCell align="center" className="table-head">
                  {useMaintenanceLocales("openIssuesTable.cameraId")}
                </TableCell>
                <TableCell align="center" className="table-head">
                  {useMaintenanceLocales("openIssuesTable.status")}
                </TableCell>
                <TableCell align="center" className="table-head">
                  {useMaintenanceLocales("openIssuesTable.errorCode")}
                </TableCell>
                <TableCell align="center" className="table-head">
                  {useMaintenanceLocales("openIssuesTable.date")}
                </TableCell>
                <TableCell align="center" className="table-head">
                  {useMaintenanceLocales("openIssuesTable.summary")}
                </TableCell>
                <TableCell align="center" className="table-head">
                  {useMaintenanceLocales("openIssuesTable.location")}
                </TableCell>
                <TableCell align="center" className="table-head">
                  {useMaintenanceLocales("openIssuesTable.Actions")}
                </TableCell>
                <TableCell align="center" className="table-head"></TableCell>
              </TableRow>
            </TableHead>
            {props.issues.length === 0 ? (
              <TableBody sx={{position: "relative", height: "500px"}}>
                <NoData />
              </TableBody>
            ) : (
              <TableBody className="h-420">
                {props.issues.map((row) => (
                  <OpenIssueRow issue={row} key={row.id} />
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

const OpenIssueRow = (props: {issue: MaintenanceIssueSummary}) => {
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
      key={props.issue.id}
      onClick={() => handleRowClick(getIssueUrl(props.issue))}>
      <TableCell size="small" component="th" scope="row" align="center">
        {props.issue.cameraId}
      </TableCell>
      <TableCell
        size="small"
        component="th"
        scope="row"
        align="center"
        className={
          props.issue.status === MaintenanceIssueStatus.open
            ? "!text-success"
            : "!text-warning"
        }>
        {props.issue.status}
      </TableCell>
      <TableCell size="small" component="th" scope="row" align="center">
        450
      </TableCell>
      <TableCell size="small" component="th" scope="row" align="center">
        {formatDateString(props.issue.createdAt)}
      </TableCell>
      <Tooltip
        title={props.issue.summary}
        placement="right-start"
        arrow
        sx={{top: "226px"}}>
        <TableCell
          size="small"
          component="th"
          scope="row"
          align="center"
          className="w-96 max-w-60">
          {props.issue.summary}
        </TableCell>
      </Tooltip>
      <TableCell
        align="center"
        component="th"
        scope="row">{`${splitAndChooseDescription(
        props.issue.description,
        "first"
      )}`}</TableCell>
      <TableCell align="center" width={200} className="flex">
        <IconButton>
          <div className="flex gap-2">
            <EyeIcon color="info" />
            {props.issue.status === "Open" ? (
              <PlayIcon color="primary" />
            ) : (
              <StopIcon color="success" />
            )}
          </div>
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
