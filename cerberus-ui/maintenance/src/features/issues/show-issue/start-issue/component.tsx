import {Button} from '@mui/material';
import {Mediator} from 'mediatr-ts';
import {useState} from 'react';
import {StartIssue} from './command.ts';

export const StartIssueForm = (props: {issueId: string}) => {
  const {issueId} = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Mediator().send(new StartIssue(issueId));
      setSuccess(true);
    } catch (e) {
      setError(e);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Button
        variant='contained'
        size='small'
        disabled={isSubmitting}
        type='submit'
        fullWidth
        className='submit-btn !max-w-48'>
        Start
      </Button>
      {error && <div>{error}</div>}
      {success && <div>Issue started</div>}
    </form>
  );
};
