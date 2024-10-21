import {
  MaintenanceSettingsView,
  OpenIssuesView,
  PendingTrainingReviewsView,
} from "@cerberus/maintenance";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import {Box, IconButton, Tooltip} from "@mui/material";
import {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {HeaderComponent, TabsBar} from "../../../ui-components";
import {CameraSettings} from "../../cameras/edit-camera/CameraSettings/CameraSettings.tsx";
import {EditCamera} from "../../cameras/edit-camera/component.tsx";
import {HierarchyItemType} from "../../state/hierarchy-item.ts";
import {CameraCapturesView} from "./list-camera-captures/component";
import {TabPanelProps} from "./model.ts";
import {LocationSettingsView} from "./show-location-settings/component";
import {LocationSettings} from "./show-location-settings/model.ts";
export const LocationPage = () => {
  const {id} = useParams();
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
    navigate({search: params.toString()}, {replace: true});
  }, [selectedTab]);

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
          <>
            <div className="flex !flex-row !justify-end bg-tableBg w-[520px]">
              <Tooltip title={"Editar"}>
                <IconButton
                  color="primary"
                  onClick={EditCamera(settings?.parentId || "")}>
                  <ModeEditOutlineIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={"Esborrar"}>
                <IconButton color="error">
                  <DeleteForeverIcon />
                </IconButton>
              </Tooltip>
            </div>
            <LocationSettingsView
              id={id}
              type={itemType}
              content={CameraSettings}
              onFetchComplete={(id) => setSettings(id)}
            />
          </>
        </CustomTabPanel>
        <CustomTabPanel value={selectedTab} index={6}>
          <CameraCapturesView id={id} />
        </CustomTabPanel>
        <CustomTabPanel value={selectedTab} index={8}>
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
