import {
  OpenIssuesView,
  PendingTrainingReviewsView,
  MaintenanceSettingsView
} from "@cerberus/maintenance";
import {Box} from "@mui/material";
import {useState} from "react";
import {useLocation, useParams} from "react-router-dom";
import {HeaderComponent, TabsBar} from "../../../ui-components";
import {HierarchyItemType} from "../../state/hierarchy-item.ts";
import {CameraCapturesView} from "./list-camera-captures/component";
import {TabPanelProps} from "./model.ts";
import {LocationSettingsView} from "./show-location-settings/component";
import {LocationSettingsTable} from "./show-location-settings/show-location-table/component.tsx";
export const LocationPage = () => {
  const {id} = useParams();
  const query = new URLSearchParams(useLocation().search);
  const itemType =
    (query.get("item-type") as HierarchyItemType) || HierarchyItemType.location;

  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className="flex flex-col flex-1 w-full ">
      <LocationSettingsView id={id} type={itemType} content={HeaderComponent} />
      <div className="flex flex-col flex-1 w-full gap-4">
        <TabsBar
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          itemType={itemType}
        />
        <CustomTabPanel value={selectedTab} index={0}>
          <OpenIssuesView id={id} />
        </CustomTabPanel>
        <CustomTabPanel value={selectedTab} index={2}>
          <PendingTrainingReviewsView id={id} />
        </CustomTabPanel>
        <CustomTabPanel value={selectedTab} index={4}>
          <LocationSettingsView
            id={id}
            type={itemType}
            content={LocationSettingsTable}
          />
        </CustomTabPanel>
        <CustomTabPanel value={selectedTab} index={6}>
          <CameraCapturesView id={id} />
        </CustomTabPanel>
        <CustomTabPanel index={8} value={selectedTab}>
            <MaintenanceSettingsView id={id} />
        </CustomTabPanel>
      </div>
    </div>
  );
};

const CustomTabPanel = (props: TabPanelProps) => {
  const {children, value, index, ...other} = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && <Box sx={{p: 3}}>{children}</Box>}
    </div>
  );
};
