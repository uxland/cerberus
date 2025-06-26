import { CustomDivider } from "@cerberus/core";
import { Box, Tab, Tabs } from "@mui/material";
import { HierarchyItemType } from "../../features/state/hierarchy-item";
import { useOrganizationalStructureLocales } from "../../locales/ca/locales";

export enum TabPanelType {
  // OpenIssues = 0,
  // Analysis = 2,
  Settings = 0,
  Rounds = 2,
  Inspections = 4,
  Reports = 6,
  MaintenanceSettings = 2,
}

export const TabsBar = (props: {
  selectedTab: number;
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>;
  itemType: HierarchyItemType;
}) => {
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    props.setSelectedTab(newValue);
  };

  const { itemType, selectedTab } = props;

  const settingsLabel = useOrganizationalStructureLocales("tabs.settings");
  const maintenancesSettingsLabel = useOrganizationalStructureLocales(
    "tabs.maintenancesSettings"
  );

  const roundsLabel = useOrganizationalStructureLocales(
    "tabs.rounds"
  );
  const capturesLabel = useOrganizationalStructureLocales(
    "tabs.captures"
  );
  const inspectionsLabel = useOrganizationalStructureLocales(
    "tabs.inspections"
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
        {/* <Tab
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
        <CustomDivider /> */}
        <Tab label={settingsLabel} {...a11yProps(TabPanelType.Settings)} />
        <CustomDivider />
        {itemType === HierarchyItemType.location && (
          <Tab
            label={roundsLabel}
            {...a11yProps(TabPanelType.Rounds)}
          />)}
        {/* {itemType === HierarchyItemType.camera && (
          <Tab label={reportsLabel} {...a11yProps(TabPanelType.Reports)} />
        )}
        {itemType === HierarchyItemType.camera && <CustomDivider />} */}
        {itemType === HierarchyItemType.camera && (
          <Tab
            label={maintenancesSettingsLabel}
            {...a11yProps(TabPanelType.MaintenanceSettings)}
          />

        )}
        <CustomDivider />
        {itemType === HierarchyItemType.camera ? (
          <Tab
            label={capturesLabel}
            {...a11yProps(TabPanelType.Inspections)}
          />

        ) : itemType === HierarchyItemType.location ? (
          <Tab
            label={inspectionsLabel}
            {...a11yProps(TabPanelType.Inspections)}
          />
        ) :
          null
        }
      </Tabs>
    </Box>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};
