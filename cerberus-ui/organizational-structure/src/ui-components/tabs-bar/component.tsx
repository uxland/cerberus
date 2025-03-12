import { CustomDivider } from "@cerberus/core";
import { Badge, Box, Tab, Tabs } from "@mui/material";
import { HierarchyItemType } from "../../features/state/hierarchy-item";
import { useOrganizationalStructureLocales } from "../../locales/ca/locales";

export enum TabPanelType {
  OpenIssues = 0,
  Analysis = 2,
  Settings = 4,
  Reports = 6,
  MaintenanceSettings = 10,
  Operations = 6,
  Rounds = 8,
}

export const TabsBar = (props: {
  selectedTab: number;
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>;
  itemType: HierarchyItemType;
}) => {
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    props.setSelectedTab(newValue);
  };

  const { itemType, selectedTab } = props;

  const openIssuesLabel = useOrganizationalStructureLocales("tabs.openIssues");
  const pendingReviewsLabel = useOrganizationalStructureLocales(
    "tabs.pendingReviews"
  );
  const settingsLabel = useOrganizationalStructureLocales("tabs.settings");
  const reportsLabel = useOrganizationalStructureLocales("tabs.reports");
  const maintenancesSettingsLabel = useOrganizationalStructureLocales(
    "tabs.maintenancesSettings"
  );
  const operationsLabel = useOrganizationalStructureLocales(
    "tabs.operations"
  );
  const roundsLabel = useOrganizationalStructureLocales(
    "tabs.rounds"
  );
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flex: "0",
        flexDirection: "row",
        borderBottom: 1,
        borderColor: "divider",
      }}>
      <Tabs
        value={selectedTab}
        onChange={handleChange}
        aria-label="organizational-tab"
        variant="scrollable"
        scrollButtons="auto">
        <Tab
          label={
            <CustomTabLabel
              label={openIssuesLabel}
              badgeContent={46}
              width={140}
            />
          }
          {...a11yProps(TabPanelType.OpenIssues)}
        />
        <CustomDivider />
        <Tab
          label={
            <CustomTabLabel
              label={pendingReviewsLabel}
              badgeContent={25}
              width={140}
            />
          }
          {...a11yProps(TabPanelType.Analysis)}
        />
        <CustomDivider />
        <Tab label={settingsLabel} {...a11yProps(TabPanelType.Settings)} />
        <CustomDivider />
        <Tab
          label={operationsLabel}
          {...a11yProps(TabPanelType.Operations)}
        />
        <CustomDivider />
        {itemType === HierarchyItemType.location && (
          <Tab
            label={roundsLabel}
            {...a11yProps(TabPanelType.Rounds)}
          />)}
        {itemType === HierarchyItemType.camera && (
          <Tab label={reportsLabel} {...a11yProps(TabPanelType.Reports)} />
        )}
        {itemType === HierarchyItemType.camera && <CustomDivider />}
        {itemType === HierarchyItemType.camera && (
          <Tab
            label={maintenancesSettingsLabel}
            {...a11yProps(TabPanelType.MaintenanceSettings)}
          />

        )}

      </Tabs>
    </Box>
  );
};

const CustomTabLabel = ({ label, badgeContent, width }) => (
  <Box display="flex" alignItems="center" minWidth={width} gap={2}>
    <span>{label}</span>
    <Badge
      badgeContent={badgeContent}
      overlap="circular"
      color="error"
      className="MuiBadge-badge"
    />
  </Box>
);

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};
