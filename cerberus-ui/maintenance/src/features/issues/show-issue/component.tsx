import {getImageUrl, nop} from '@cerberus/core';
import {Typography} from '@mui/material';
import {format} from 'date-fns';
import {Mediator} from 'mediatr-ts';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {MaintenanceIssueStatus} from '../model.ts';
import {CloseIssueForm} from './close-issue/component.tsx';
import {MaintenanceIssueDetail} from './model.ts';
import {Query} from './query.ts';
import {StartIssueForm} from './start-issue/component.tsx';

export const MaintenanceIssuePage = () => {
  const {id} = useParams();
  const [issue, setIssue] = useState<MaintenanceIssueDetail>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setLoading(true);
        setError(undefined);
        const issue = await new Mediator().send(new Query(id));
        setIssue(issue);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchIssue().then(nop);
  }, [id]);

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {issue && IssueComponent({issue})}
    </div>
  );
};

const IssueComponent = (props: {issue: MaintenanceIssueDetail}) => {
  const {issue} = props;
  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy hh:mm:ss a');
  };

  return (
    <div className='flex flex-col gap-1'>
      {Header(issue)}

      {/* <div>Error: {issue.captureError.message}</div>
      <div>ErrorType: {issue.captureError.type}</div>
      <div>Comment: {issue.resolutionComment}</div>
      <div>SnapshotUrl: {issue.snapshotUrl}</div>

      <div>FinishedAt: {formatDateString(issue?.finishedAt)}</div>
      <div>Started: {formatDateString(issue.startedAt)}</div>
      <div>Started: {issue.startedBy}</div> */}

      <img src={getImageUrl(issue.snapshotUrl)} alt={issue.cameraDescription} />
      {issue.status === MaintenanceIssueStatus.open && (
        <StartIssueForm issueId={issue.id} />
      )}
      {issue.status === MaintenanceIssueStatus.inProgress && (
        <CloseIssueForm issueId={issue.id} />
      )}
    </div>
  );
};

const Header = (issue) => {
  const idNumber = issue?.id.toUpperCase().split('MAINTENANCE-ISSUE-');
  return (
    <>
      <Typography variant='h2' color='#fff'>
        Maintenance Issue
      </Typography>
      <div className='flex gap-4'>
        <Typography variant='h3' color='#fff'>
          <span className='font-semibold'>{issue.cameraDescription}</span> (
          {issue.cameraPath})
        </Typography>
        <Typography variant='h4' color='#828282'>
          id: {idNumber}
        </Typography>
      </div>
    </>
  );
};
