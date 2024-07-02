import {nop} from '@cerberus/core';
import {splitAndChooseDescription} from '@cerberus/shared/src/index.ts';
import {
  IconButton,
  Paper,
  SvgIcon,
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
import {useNavigate} from 'react-router-dom';
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
  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy hh:mm:ss a');
  };

  const navigate = useNavigate();
  const handleRowClick = (url) => {
    navigate(url);
  };
  const handleIconClick = (event, url) => {
    event.stopPropagation();
    navigate(url);
  };
  const icons = {
    eye: (
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
        <path d='M21.914 11.573a13.858 13.858 0 0 0-3.228-4.547A9.767 9.767 0 0 0 12 4.228a9.768 9.768 0 0 0-6.686 2.798 13.75 13.75 0 0 0-3.23 4.55 1.104 1.104 0 0 0 0 .854 13.75 13.75 0 0 0 3.23 4.544 9.768 9.768 0 0 0 6.686 2.798 9.767 9.767 0 0 0 6.685-2.798 13.822 13.822 0 0 0 3.228-4.547 1.104 1.104 0 0 0 0-.854Zm-4.363 4.19a8.12 8.12 0 0 1-5.55 2.35 8.14 8.14 0 0 1-5.554-2.35 12.398 12.398 0 0 1-2.728-3.76A12.359 12.359 0 0 1 6.45 8.246 8.12 8.12 0 0 1 12 5.895a8.14 8.14 0 0 1 5.554 2.35 12.398 12.398 0 0 1 2.729 3.759 12.358 12.358 0 0 1-2.732 3.759Zm-5.55-8.203a4.439 4.439 0 1 0 0 8.88 4.439 4.439 0 0 0 0-8.88Zm0 7.22h-.004a2.776 2.776 0 0 1-2.773-2.777v-.07a2.224 2.224 0 0 0 2.708-2.708H12a2.777 2.777 0 0 1 0 5.555Z' />
      </svg>
    ),
    trash: (
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
        <path d='M10.573 18.19H8.668V7.714h1.905V18.19Zm4.76-10.476H13.43V18.19h1.905V7.714Zm5.714-3.81V5.81h-.952v14.285A1.905 1.905 0 0 1 18.19 22H5.81a1.905 1.905 0 0 1-1.905-1.905V5.81h-.952V3.905h3.81L7.715 2h8.572l.952 1.905h3.808ZM18.19 5.81H5.81v14.285h12.38V5.81Z' />
      </svg>
    ),
  };

  return (
    <Paper
      sx={{
        width: '100%',
        height: 600,
        maxWidth: 1260,
        overflow: 'auto',
      }}>
      <TableContainer component={Paper} className='table'>
        <Table sx={{minWidth: 450, maxWidth: 1260}} aria-label='simple table'>
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
          <TableBody className='h-400'>
            {reviews.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => handleRowClick(getPendingReviewUrl(row))}>
                <TableCell
                  size='small'
                  component='th'
                  scope='row'
                  align='center'>
                  {row.id}
                </TableCell>
                <TableCell size='small' align='center'>
                  IMAGE
                </TableCell>
                <TableCell size='small' align='center'>
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
                <TableCell align='center' width={200} className='flex'>
                  <IconButton>
                    <SvgIcon fill='#4791ff'>{icons.eye}</SvgIcon>
                  </IconButton>
                  <IconButton onClick={(event) => handleIconClick(event, '/')}>
                    <SvgIcon fill='#d14c4c'>{icons.trash}</SvgIcon>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
