import {
  MaintenanceSettingsView,
} from "@cerberus/maintenance";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TabsBar } from "../../../ui-components";
import { EditSettings } from "../../edit-settings/component.tsx";
import { HierarchyItemSettings } from "../../edit-settings/HierarchyItemSettings/HierarchyItemSettings.tsx";
import { HierarchyItemType } from "../../state/hierarchy-item.ts";
import { CameraCapturesView } from "./list-camera-captures/component";
import { TabPanelProps } from "./model.ts";
import { LocationSettingsView } from "./show-location-settings/component";
import { LocationSettings } from "./show-location-settings/model.ts";
import { RoundsView } from "@cerberus/surveillance";
import { useOrganizationalStructureLocales } from "../../../locales/ca/locales.ts";
import { LocationRunsView } from "@cerberus/surveillance/src/features/run/list/byLocation/component.tsx";

export const LocationPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const itemType =
    (query.get("item-type") as HierarchyItemType) || HierarchyItemType.location;
  const initialTab = Number.parseInt(query.get("tab") || "0", 10);

  const [settings, setSettings] = useState<LocationSettings | null>(null);
  const [selectedTab, setSelectedTab] = useState(initialTab);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set("tab", selectedTab.toString());
    navigate({ search: params.toString() }, { replace: true });
  }, [selectedTab]);

  return (
    <div className="flex flex-col flex-1 h-full">
      {/* <LocationSettingsView id={id} type={itemType} content={HeaderComponent} /> */}
      <div className="flex flex-col h-full gap-4">
        <TabsBar
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          itemType={itemType}
        />
        {/* <CustomTabPanel value={selectedTab} index={0}>
          <OpenIssuesView id={id} />
        </CustomTabPanel>
        <CustomTabPanel value={selectedTab} index={2}>
          <PendingTrainingReviewsView id={id} />
        </CustomTabPanel> */}
        <CustomTabPanel value={selectedTab} index={0}>
          <div className="flex !flex-row !justify-end bg-tableBg w-[520px] rounded-t-lg">
            <Tooltip title={useOrganizationalStructureLocales("edit")}>
              <IconButton
                color="primary"
                onClick={EditSettings(settings, itemType)}>
                <ModeEditOutlineIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={useOrganizationalStructureLocales("delete")}>
              <IconButton color="error">
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>
          </div>
          <LocationSettingsView
            id={id}
            type={itemType}
            content={(settings) => HierarchyItemSettings(settings, itemType)}
            onFetchComplete={(id) => setSettings(id)}
          />
        </CustomTabPanel>
        {itemType === HierarchyItemType.location ? (
          <CustomTabPanel value={selectedTab} index={2}>
            <RoundsView id={id} />
          </CustomTabPanel>
        ) : itemType === HierarchyItemType.camera ? (
          <CustomTabPanel value={selectedTab} index={2}>
            <MaintenanceSettingsView id={id} />
          </CustomTabPanel>
        ) : null}

        {itemType === HierarchyItemType.location ? (
          <CustomTabPanel value={selectedTab} index={4}>
            <LocationRunsView id={id} />
          </CustomTabPanel>
        ) : itemType === HierarchyItemType.camera ? (
          <CustomTabPanel value={selectedTab} index={4}>
            <CameraCapturesView id={id} />
          </CustomTabPanel>
        ) : null}



      </div>
    </div>
  );
};

const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  if (value !== index) {
    return null;
  }

  return (
    <div
      className="h-full p-3 flex flex-col flex-1"
      role="tabpanel"
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {children}
    </div>
  );
};
