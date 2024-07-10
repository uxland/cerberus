import {Button, Divider, Paper, Typography} from '@mui/material';
import {format} from 'date-fns';
import {Mediator} from 'mediatr-ts';
import {useState} from 'react';
import {
  FilterResult,
  CaptureError as ICaptureError,
  MaintenanceIssueDetail,
} from '../model.ts';
import {StartIssue} from './command.ts';

export const StartIssueForm = (props: {issue: MaintenanceIssueDetail}) => {
  const {issue} = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Mediator().send(new StartIssue(issue.id));
      setSuccess(true);
    } catch (e) {
      setError(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper className='custom-table p-4 w-[480px] 3xl:w-[580px] xl:w-full '>
      <div className='flex flex-col mb-4'>
        <Typography className='!text-lg'>Error Description</Typography>
        <Divider orientation='horizontal' className='bg-gray-300 !h-0' />
      </div>
      <div className='flex flex-col w-full gap-8 items-end'>
        <div className='flex flex-col gap-6 w-full'>
          {issue.captureError ? (
            <CaptureError captureError={issue.captureError} />
          ) : (
            Object.keys(issue?.errors || {}).map((key) => {
              const error = issue?.errors?.[key];
              return <FilterError key={key} issue={error} />;
            })
          )}
        </div>
        <div className='flex justify-end'>
          <Button
            variant='contained'
            size='small'
            color='success'
            disabled={isSubmitting}
            fullWidth
            className='!rounded-2xl !w-52 !text-white !bg-[#02bc77]'
            onClick={handleSubmit}>
            Start
          </Button>
          {error && <div>{error}</div>}
          {success && <div>Issue started</div>}
        </div>
      </div>
    </Paper>
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
      <Typography variant='body1'>{props?.issue?.result}</Typography>
    </div>
  );
};

const CaptureError = (props: {captureError: ICaptureError}) => {
  return (
    <div>
      <Typography variant='body1'>
        <span style={{fontWeight: 'bold'}}>{props?.captureError?.type}</span>
      </Typography>
      <Typography variant='body1'>{props?.captureError?.message}</Typography>
    </div>
  );
};
