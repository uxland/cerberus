import {getImageUrl, nop} from '@cerberus/core';
import {Typography} from '@mui/material';
import {Mediator} from 'mediatr-ts';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {HeaderBar} from '../../../ui-components/index.ts';
import {ImageComponent} from '../../../ui-components/issue-image/component.tsx';
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
    <div className='flex flex-col w-full gap-6'>
      <HeaderBar component={HeaderContent(issue)} close={true} />
      <div className='flex flex-col 3xl:flex-row gap-6 '>
        <div className='max-h-[580px] lg:w-[1200px] rounded-[10px] overflow-hidden'>
          <ImageComponent
            src={getImageUrl(props.issue?.snapshotUrl)}
            alt={props.issue.cameraDescription}
            className='w-full object-cover h-[580px]'
          />
        </div>
        <div className='custom-table'>
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

const HeaderContent = (issue) => {
  const idNumber = issue?.id.toUpperCase().split('MAINTENANCE-ISSUE-');
  return (
    <div className='flex gap-4'>
      <div className='flex gap-2'>
        <Typography variant='h5' color='#fff' className='!tracking-widest'>
          {issue.cameraPath}
        </Typography>
        <Typography variant='h5' color='#fff'>
          <span className='font-semibold'>{issue.cameraDescription}</span>
        </Typography>
      </div>
      <Typography variant='h5' color='#fff'>
        id: {idNumber}
      </Typography>
    </div>
  );
};
