import {Badge, Box, Divider, Tab, Tabs} from '@mui/material';
import {useOrganizationalStructureLocales} from '../../locales/ca/locales';

export const TabsBar = (props: {
  selectedTab: number;
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    props.setSelectedTab(newValue);
  };
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flex: '1',
        flexDirection: 'row',
        borderBottom: 1,
        borderColor: 'divider',
      }}>
      <Tabs
        value={props.selectedTab}
        onChange={handleChange}
        aria-label='organitzational-tab'>
        <Tab
          label={
            <CustomTabLabel
              label={useOrganizationalStructureLocales('tabs.openIssues')}
              badgeContent={46}
              width={140}
            />
          }
          {...a11yProps(0)}
        />
        <CustomDivider />
        <Tab
          label={
            <CustomTabLabel
              label={useOrganizationalStructureLocales('tabs.pendingReviews')}
              badgeContent={25}
              width={105}
            />
          }
          {...a11yProps(2)}
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
  );
};

const CustomTabLabel = ({label, badgeContent, width}) => (
  <Box display='flex' alignItems='center' minWidth={width} gap={2}>
    <span>{label}</span>
    <Badge
      badgeContent={badgeContent}
      overlap='circular'
      color='error'
      className='MuiBadge-badge'
    />
  </Box>
);
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

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};
