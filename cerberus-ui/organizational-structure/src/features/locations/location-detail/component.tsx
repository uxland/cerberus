import AccessAlarmsOutlinedIcon from '@mui/icons-material/AccessAlarmsOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import {Box} from '@mui/material';
import {useState} from 'react';
import {useLocation, useParams} from 'react-router-dom';
import {
  OpenIssuesPerformanceItem,
  OpenIssuesView,
  PendingTrainingReviewsView,
} from '../../../../../maintenance';
import {TabsBar} from '../../../ui-components';
import {HierarchyItemType} from '../../show-organizational-structure/hierarchy-item';
import {CameraCapturesView} from './list-camera-captures/component';
import {LocationSettingsView} from './show-location-settings/component';
export const LocationPage = () => {
  const {id} = useParams();
  const query = new URLSearchParams(useLocation().search);
  const itemType =
    (query.get('item-type') as HierarchyItemType) || HierarchyItemType.location;

  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className='flex flex-col flex-1 w-full '>
      <LocationSettingsView id={id} type={itemType} />
      <div className='flex flex-col flex-1 w-full gap-4'>
        <TabsBar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        <div className='grid grid-cols-2  2xl:grid-cols-4 justify-items-center gap-8 w-full'>
          <OpenIssuesPerformanceItem
            title={'Open Issues (7 days)'}
            icon={<ErrorOutlineOutlinedIcon className='kpi-icon error' />}
            currentSevenDays={'125'}
            previousSevenDays={'75'}
          />
          <OpenIssuesPerformanceItem
            title={'Closed issues (7 days)'}
            icon={<CheckCircleOutlinedIcon className='kpi-icon success' />}
            currentSevenDays={'125'}
            previousSevenDays={'75'}
          />
          <OpenIssuesPerformanceItem
            title={'Total effort in hours (7 days)'}
            icon={<AccessAlarmsOutlinedIcon className='kpi-icon warning' />}
            currentSevenDays={'125'}
            previousSevenDays={'75'}
          />
          <OpenIssuesPerformanceItem
            title={'Average effort in hours (7 days)'}
            icon={<AccessAlarmsOutlinedIcon className='kpi-icon info' />}
            currentSevenDays={'125'}
            previousSevenDays={'75'}
          />
        </div>
        <CustomTabPanel value={selectedTab} index={0}>
          <OpenIssuesView id={id} />
        </CustomTabPanel>
        <CustomTabPanel value={selectedTab} index={2}>
          <PendingTrainingReviewsView id={id} />
        </CustomTabPanel>
        <CustomTabPanel value={selectedTab} index={4}>
          <div className='flex h-full w-full'>
            <div>Settings</div>
          </div>
        </CustomTabPanel>
        <CustomTabPanel value={selectedTab} index={6}>
          <CameraCapturesView id={id} />
        </CustomTabPanel>
      </div>
    </div>
  );
};
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const CustomTabPanel = (props: TabPanelProps) => {
  const {children, value, index, ...other} = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && <Box sx={{p: 3}}>{children}</Box>}
    </div>
  );
};
