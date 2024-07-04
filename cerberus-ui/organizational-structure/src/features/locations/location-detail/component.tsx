import {Box} from '@mui/material';
import {useState} from 'react';
import {useLocation, useParams} from 'react-router-dom';
import {
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
