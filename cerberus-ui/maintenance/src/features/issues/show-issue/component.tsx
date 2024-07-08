import {getImageUrl, nop} from '@cerberus/core';
import {Typography} from '@mui/material';
import {Mediator} from 'mediatr-ts';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {MaintenanceIssueStatus} from '../model.ts';
import {CloseIssueForm} from './close-issue/component.tsx';
import {GetIssueDetail} from './getIssueDetail.ts';
import {MaintenanceIssueDetail} from './model.ts';
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
        const issue = await new Mediator().send(new GetIssueDetail(id));
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

  return (
    <div className='flex flex-col gap-4'>
      {Header(issue)}
      <div className='w-full grid grid-cols-2 gap-8'>
        <div className='rounded-[10px] overflow-hidden w-12/12'>
          <img
            src={getImageUrl(issue.snapshotUrl)}
            alt={issue.cameraDescription}
          />
        </div>
        <div className='flex justify-end w-12/12'>
          {issue.status === MaintenanceIssueStatus.open && (
            <StartIssueForm issue={issue} />
          )}
          {issue.status === MaintenanceIssueStatus.inProgress && (
            <CloseIssueForm issue={issue} />
          )}
        </div>
      </div>
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
