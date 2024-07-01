import {Box, Divider, Tab, Tabs} from '@mui/material';
import {useState} from 'react';
import {useLocation, useParams} from 'react-router-dom';
import {
  OpenIssuesView,
  PendingTrainingReviewsView,
} from '../../../../../maintenance';
import {useOrganizationalStructureLocales} from '../../../locales/ca/locales';
import {HierarchyItemType} from '../../show-organizational-structure/hierarchy-item';
import {CameraCapturesView} from './list-camera-captures/component';
export const LocationPage = () => {
  const {id} = useParams();
  const query = new URLSearchParams(useLocation().search);
  const itemType =
    (query.get('item-type') as HierarchyItemType) || HierarchyItemType.location;
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const CustomDivider = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}>
        <Divider
          orientation='vertical'
          variant='middle'
          color='#828282'
          flexItem
        />
      </Box>
    );
  };
  return (
    <div className='flex flex-col'>
      <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          aria-label='organitzational-tab'>
          <Tab
            label={useOrganizationalStructureLocales('tabs.openIssues')}
            {...a11yProps(0)}
          />
          <CustomDivider />
          <Tab
            label={useOrganizationalStructureLocales('tabs.pendingReviews')}
            {...a11yProps(1)}
          />
          <CustomDivider />
          <Tab
            label={useOrganizationalStructureLocales('tabs.settings')}
            {...a11yProps(2)}
          />
          <CustomDivider />
          <Tab
            label={useOrganizationalStructureLocales('tabs.captures')}
            {...a11yProps(3)}
          />
        </Tabs>
      </Box>
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
        <CameraCapturesView
          id={id}
          //   style={{
          //     display: itemType === HierarchyItemType.camera ? 'block' : 'none',
          //   }}
        />
      </CustomTabPanel>
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

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};
