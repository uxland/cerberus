import AccessAlarmsOutlinedIcon from '@mui/icons-material/AccessAlarmsOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import {OpenIssuesPerformanceItem} from '../key-performance-indicators/component';

export const OpenIssuesPerformanceList = () => {
  return (
    <div className='grid grid-cols-2  2xl:grid-cols-4 gap-8 w-full'>
      <OpenIssuesPerformanceItem
        title={'Open Issues (7 days)'}
        icon={<ErrorOutlineOutlinedIcon className='kpi-icon error' />}
        currentSevenDays={'148'}
        previousSevenDays={'185'}
        percentage={'-10'}
        type={'error'}
      />
      <OpenIssuesPerformanceItem
        title={'Closed issues (7 days)'}
        icon={<CheckCircleOutlinedIcon className='kpi-icon success' />}
        currentSevenDays={'180'}
        previousSevenDays={'112'}
        percentage={'10'}
      />
      <OpenIssuesPerformanceItem
        title={'Total effort in hours (7 days)'}
        icon={<AccessAlarmsOutlinedIcon className='kpi-icon warning' />}
        currentSevenDays={'180'}
        previousSevenDays={'185'}
        percentage={'10'}
      />
      <OpenIssuesPerformanceItem
        title={'Average effort in hours (7 days)'}
        icon={<AccessAlarmsOutlinedIcon className='kpi-icon info' />}
        currentSevenDays={'1,78'}
        previousSevenDays={'1,13'}
        percentage={'10'}
      />
    </div>
  );
};
