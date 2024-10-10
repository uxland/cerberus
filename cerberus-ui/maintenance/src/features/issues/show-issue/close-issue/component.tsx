import {notificationService} from '@cerberus/core';
import {Button, Divider, Paper, Typography} from '@mui/material';
import {format} from 'date-fns';
import {Mediator} from 'mediatr-ts';
import {useState} from 'react';
import {useMaintenanceLocales} from '../../../../locales/ca/locales.ts';
import {Timer} from '../../../../ui-components/index.ts';
import {CustomTextArea} from '../../../../ui-components/text-area/component.tsx';
import {
  FilterResult,
  CaptureError as ICaptureError,
  MaintenanceIssueDetail,
} from '../model.ts';
import {CloseIssue} from './command.ts';

export const CloseIssueForm = (props: {issue: MaintenanceIssueDetail}) => {
  const {issue} = props;
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const successMessage: string = useMaintenanceLocales(
    'openIssuesForm.notification.close.onSuccess'
  );
  const errorMessage: string = useMaintenanceLocales(
    'openIssuesForm.notification.close.onError'
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Mediator().send(new CloseIssue(issue.id, comment));
      notificationService.notifySuccess(successMessage);
      setSuccess(true);
    } catch (e) {
      notificationService.notifyError(errorMessage);
      setError(e);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Paper className='custom-table p-4 w-[480px] lg:w-full 3xl:w-[580px]'>
      <div className='flex flex-col mb-4'>
        <Typography className='!text-lg'>
          {useMaintenanceLocales('openIssuesForm.title')}
        </Typography>
        <Divider orientation='horizontal' className='bg-gray-300 !h-0' />
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4'>
        <div className='w-68 lg:w-60 gap-6'>
          {issue.captureError ? (
            <CaptureError captureError={issue.captureError} />
          ) : (
            Object.keys(issue?.errors || {}).map((key) => {
              const error = issue?.errors?.[key];
              return (
                <div className='flex flex-col xl:w-60'>
                  <FilterError key={key} issue={error} />;
                </div>
              );
            })
          )}
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-1 gap-6 w-full '>
          <CustomTextArea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className='flex lg:flex-col items-end gap-4 justify-between'>
            <div className='flex flex-col justify-between items-end w-48'>
              <Typography variant='body1'>
                {useMaintenanceLocales('openIssuesForm.resolutionTime')}:{' '}
              </Typography>
              <Timer targetDateTime={props.issue.startedAt} />
            </div>
            <Button
              variant='contained'
              size='small'
              disabled={isSubmitting}
              type='submit'
              fullWidth
              className='!rounded-2xl !max-w-48 !text-white !bg-[#ff2366]'
              onClick={handleSubmit}>
              Finish
            </Button>
            {error && <div>{error}</div>}
            {success && <div>Issue closed</div>}
          </div>
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
