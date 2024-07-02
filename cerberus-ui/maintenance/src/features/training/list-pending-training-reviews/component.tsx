import {nop} from '@cerberus/core';
import {splitAndChooseDescription} from '@cerberus/shared/src/index.ts';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {format} from 'date-fns';
import {Mediator} from 'mediatr-ts';
import {useEffect, useState} from 'react';
import {PendingTrainingReview} from './model.ts';
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
  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy hh:mm:ss a');
  };

  return (
    <TableContainer component={Paper} className='table'>
      <Table sx={{minWidth: 650}} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell align='center'>ID</TableCell>
            <TableCell align='center'>Preview</TableCell>
            <TableCell align='center'>Date</TableCell>
            <TableCell align='center'>Location</TableCell>
            <TableCell align='center'>Description</TableCell>
            <TableCell align='center'>Action</TableCell>
            <TableCell align='center'></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reviews.map((row) => (
            <TableRow
              key={row.id}
              sx={{'&:last-child td, &:last-child th': {border: 0}}}>
              <TableCell component='th' scope='row' align='center'>
                {row.id}
              </TableCell>
              <TableCell align='center'>IMAGE</TableCell>
              <TableCell align='center'>
                {formatDateString(row.createdAt)}
              </TableCell>
              <TableCell align='center'>{`${splitAndChooseDescription(
                row.description,
                'first'
              )}`}</TableCell>
              <TableCell align='center'>{`${splitAndChooseDescription(
                row.description,
                'second'
              )}`}</TableCell>
              <TableCell align='center'>Icons</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
  // return (
  //     <div>
  //         <h1>Pending Training Reviews</h1>
  //         {loading && <div>Loading...</div>}
  //         {error && <div>{error}</div>}
  //         <ul>
  //             {reviews.map((review) => (
  //                 <li key={review.id}>
  //                     <div>{review.description}</div>
  //                     <div>{review.createdAt}</div>
  //                 </li>
  //             ))}
  //         </ul>
  //     </div>
  // );
};
