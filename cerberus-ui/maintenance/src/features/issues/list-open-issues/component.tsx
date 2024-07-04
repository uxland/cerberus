import {nop} from '@cerberus/core';
import {splitAndChooseDescription} from '@cerberus/shared/src/index.ts';
import PlayIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import StopIcon from '@mui/icons-material/StopCircleOutlined';
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
  Tooltip,
  Typography,
} from '@mui/material';
import {format} from 'date-fns';
import {Mediator} from 'mediatr-ts';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useMaintenanceLocales} from '../../../locales/ca/locales.ts';
import {OpenIssuesPerformanceList} from '../../../ui-components/index.ts';
import {SummaryReportChart} from '../../../ui-components/summary-report-chart/component.tsx';
import {MaintenanceIssueSummary, getIssueUrl} from './model.ts';
import {ListOpenIssues} from './query.ts';
export const OpenIssuesView = (props: {id: string}) => {
  const [issues, setIssues] = useState<MaintenanceIssueSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(undefined);
        const issues = await new Mediator().send(new ListOpenIssues(props.id));
        setIssues(issues);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData().then(nop);
  }, [props]);
  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {issues && IssueListComponent(issues)}
    </div>
  );
};

const IssueListComponent = (issues: MaintenanceIssueSummary[]) => (
  <div className='flex flex-col gap-6'>
    <OpenIssuesPerformanceList />
    <Typography variant='h5'>
      {useMaintenanceLocales('title.openIssues')} ({issues.length})
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
            <TableRow className='font-semibold'>
              <TableCell align='center' className='table-head'>
                {useMaintenanceLocales('openIssuesTable.cameraId')}
              </TableCell>
              <TableCell align='center' className='table-head'>
                {useMaintenanceLocales('openIssuesTable.status')}
              </TableCell>

              <TableCell align='center' className='table-head'>
                {useMaintenanceLocales('openIssuesTable.errorCode')}
              </TableCell>
              <TableCell align='center' className='table-head'>
                {useMaintenanceLocales('openIssuesTable.date')}
              </TableCell>
              <TableCell align='center' className='table-head'>
                {useMaintenanceLocales('openIssuesTable.summary')}
              </TableCell>
              <TableCell align='center' className='table-head'>
                {useMaintenanceLocales('openIssuesTable.location')}
              </TableCell>
              <TableCell align='center' className='table-head'>
                {useMaintenanceLocales('openIssuesTable.Actions')}
              </TableCell>
              <TableCell align='center' className='table-head'></TableCell>
            </TableRow>
          </TableHead>
          <TableBody className='h-400'>
            {issues.map((row) => (
              <OpenIssueRow issue={row} key={row.id} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
    <SummaryReportChart />
  </div>
);

const OpenIssueRow = (props: {issue: MaintenanceIssueSummary}) => {
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
      key={props.issue.id}
      onClick={() => handleRowClick(getIssueUrl(props.issue))}>
      <TableCell size='small' component='th' scope='row' align='center'>
        {props.issue.cameraId}
      </TableCell>
      <TableCell size='small' component='th' scope='row' align='center'>
        {props.issue.status}
      </TableCell>
      <TableCell size='small' align='center'>
        450
      </TableCell>
      <TableCell size='small' align='center'>
        {formatDateString(props.issue.createdAt)}
      </TableCell>
      <Tooltip
        title={props.issue.summary}
        placement='right-start'
        arrow
        sx={{top: '226px'}}>
        <TableCell size='small' align='center' className='w-96 max-w-60'>
          {props.issue.summary}
        </TableCell>
      </Tooltip>
      <TableCell align='center'>{`${splitAndChooseDescription(
        props.issue.description,
        'first'
      )}`}</TableCell>
      <TableCell align='center' width={200} className='flex'>
        <IconButton>
          <div className='flex gap-2'>
            <EyeIcon color='info' />
            {props.issue.status === 'Open' ? (
              <PlayIcon color='primary' />
            ) : (
              <StopIcon color='success' />
            )}
          </div>
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
