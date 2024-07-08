import {Button, Divider, Paper, Typography} from '@mui/material';
import {format} from 'date-fns';
import {Mediator} from 'mediatr-ts';
import {useState} from 'react';
import {CustomTextArea} from '../../../../ui-components/text-area/component.tsx';
import {FilterResult, MaintenanceIssueDetail} from '../model.ts';
import {CloseIssue} from './command.ts';

export const CloseIssueForm = (props: {issue: MaintenanceIssueDetail}) => {
  const {issue} = props;
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Mediator().send(new CloseIssue(issue.id, comment));
      setSuccess(true);
    } catch (e) {
      setError(e);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className='w-8/12'>
      <Paper className='flex flex-col h-full w-full custom-table p-4 '>
        <div className='flex flex-col mb-4'>
          <Typography className='!text-lg'>Error Description</Typography>
          <Divider orientation='horizontal' className='bg-gray-300 !h-0' />
        </div>
        <div className='flex flex-col h-full justify-between'>
          <div className='flex flex-col gap-2'>
            {Object.keys(issue?.errors || {}).map((key) => {
              const error = issue?.errors?.[key];
              return <FilterError key={key} issue={error} />;
            })}
            <CustomTextArea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <div className='flex justify-end'>
            <Button
              variant='contained'
              size='small'
              color='success'
              disabled={isSubmitting}
              type='submit'
              fullWidth
              className='!rounded-2xl !max-w-48 !text-white'>
              Close Issue
            </Button>
            {error && <div>{error}</div>}
            {success && <div>Issue closed</div>}
          </div>
        </div>
      </Paper>
    </form>
  );
};

const FilterError = (props: {issue: FilterResult}) => {
  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy hh:mm:ss a');
  };
  return (
    <div>
      <Typography variant='body1'>{props?.issue?.filterDescription}</Typography>
      <Typography variant='body1'>{props?.issue?.errorMessage}</Typography>
      <Typography variant='body1'>
        At: {''}
        {formatDateString(props?.issue?.at)}
      </Typography>
    </div>
  );
};
