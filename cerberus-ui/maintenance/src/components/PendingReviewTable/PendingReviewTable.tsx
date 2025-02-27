import {getImageUrl} from "@cerberus/core";
import {splitAndChooseDescription} from "@cerberus/shared/src";
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
  Typography,
} from "@mui/material";
import {format} from "date-fns";
import {useNavigate} from "react-router-dom";
import {
  PendingTrainingReview,
  getPendingReviewUrl,
} from "../../features/training/list-pending-training-reviews/model";
import {useMaintenanceLocales} from "../../locales/ca/locales";
import {ImageComponent} from "../ImageComponent/ImageComponent";
import {NoData} from "../NoData/NoData";

export const PendingReviewTable = (props: {
  reviews: PendingTrainingReview[];
}) => {
  return (
    <div className="flex flex-col gap-4">
      <Typography variant="h5" className="pl-6">
        {useMaintenanceLocales("title.pendingReviews")} ({props.reviews.length})
      </Typography>
      <Paper
        className="custom-table"
        sx={{
          width: "100%",
          height: "auto",
          maxHeight: "538px",
          overflow: `${props.reviews.length === 0 ? "hidden" : "auto"}`,
        }}>
        <TableContainer component={Paper} className="custom-table">
          <Table sx={{minWidth: 450}} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center" className="table-head">
                  {useMaintenanceLocales("pendingReviewsTable.preview")}
                </TableCell>
                <TableCell align="center" className="table-head">
                  {useMaintenanceLocales("pendingReviewsTable.date")}
                </TableCell>
                <TableCell align="center" className="table-head">
                  {useMaintenanceLocales("pendingReviewsTable.location")}
                </TableCell>
                <TableCell align="center" className="table-head">
                  {useMaintenanceLocales("pendingReviewsTable.Description")}
                </TableCell>
                <TableCell align="center" className="table-head">
                  {useMaintenanceLocales("pendingReviewsTable.Actions")}
                </TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>

            {props.reviews.length === 0 ? (
              <TableBody sx={{position: "relative", height: "500px"}}>
                <NoData />
              </TableBody>
            ) : (
              <TableBody className="h-420">
                {props.reviews.map((row) => (
                  <PendingReviewRow row={row} key={row.id} />
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

const PendingReviewRow = (props: {row: PendingTrainingReview}) => {
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
      key={props.row.id}
      onClick={() => handleRowClick(getPendingReviewUrl(props.row))}>
      <TableCell size="small" align="center">
        {props.row.thumbnailUrl && (
          <div className="flex max-w-28 rounded-md overflow-hidden">
            <ImageComponent
              src={getImageUrl(props.row.thumbnailUrl)}
              alt={props.row.description}
              className="w-full h-20 object-cover"
              size="small"
            />
          </div>
        )}
      </TableCell>
      <TableCell size="small" align="center">
        {formatDateString(props.row.createdAt)}
      </TableCell>
      <TableCell align="center">{`${splitAndChooseDescription(
        props.row.description,
        "first"
      )}`}</TableCell>
      <TableCell align="center">{`${splitAndChooseDescription(
        props.row.description,
        "second"
      )}`}</TableCell>
      <TableCell align="center" width={200} className="flex">
        <IconButton>
          <EyeIcon color="info" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
