import {nop} from '@cerberus/core';
import {splitAndChooseDescription} from '@cerberus/shared/src/index.ts';
import EyeIcon from '@mui/icons-material/VisibilityOutlined';
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
} from '@mui/material';
import {format} from 'date-fns';
import {Mediator} from 'mediatr-ts';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useMaintenanceLocales} from '../../../locales/ca/locales.ts';
import {PendingTrainingReview, getPendingReviewUrl} from './model.ts';
import {ListPendingReviewsByLocation} from './query.ts';

export const PendingTrainingReviewsView = (props: {id: string}) => {
  const [reviews, setReviews] = useState<PendingTrainingReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReviews() {
      try {
        setError(undefined);
        setLoading(true);
        const reviews = await new Mediator().send(
          new ListPendingReviewsByLocation(props.id)
        );
        setReviews(reviews);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews().then(nop);
  }, [props]);

  return (
    <>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {reviews && PendingReviewListComponent(reviews)}
    </>
  );
};

const PendingReviewListComponent = (reviews: PendingTrainingReview[]) => {
  return (
    <div className='flex flex-col gap-4'>
      <Typography variant='h5'>
        {useMaintenanceLocales('title.pendingReviews')} ({reviews.length})
      </Typography>
      <Paper
        sx={{
          width: '100%',
          height: 600,
          overflow: 'auto',
        }}>
        <TableContainer component={Paper} className='table'>
          <Table sx={{minWidth: 450}} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell align='center' className='table-head'>
                  {useMaintenanceLocales('pendingReviewsTable.preview')}
                </TableCell>
                <TableCell align='center' className='table-head'>
                  {useMaintenanceLocales('pendingReviewsTable.date')}
                </TableCell>
                <TableCell align='center' className='table-head'>
                  {useMaintenanceLocales('pendingReviewsTable.location')}
                </TableCell>
                <TableCell align='center' className='table-head'>
                  {useMaintenanceLocales('pendingReviewsTable.Description')}
                </TableCell>
                <TableCell align='center' className='table-head'>
                  {useMaintenanceLocales('pendingReviewsTable.Actions')}
                </TableCell>
                <TableCell align='center'></TableCell>
              </TableRow>
            </TableHead>
            <TableBody className='h-400'>
              {reviews.map((row) => (
                <PendingReviewRow row={row} key={row.id} />
              ))}
            </TableBody>
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
    return format(date, 'dd/MM/yyyy hh:mm:ss a');
  };

  return (
    <TableRow
      key={props.row.id}
      onClick={() => handleRowClick(getPendingReviewUrl(props.row))}>
      <TableCell size='small' align='center'>
        IMAGE
      </TableCell>
      <TableCell size='small' align='center'>
        {formatDateString(props.row.createdAt)}
      </TableCell>
      <TableCell align='center'>{`${splitAndChooseDescription(
        props.row.description,
        'first'
      )}`}</TableCell>
      <TableCell align='center'>{`${splitAndChooseDescription(
        props.row.description,
        'second'
      )}`}</TableCell>
      <TableCell align='center' width={200} className='flex'>
        <IconButton>
          <EyeIcon color='info' />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
