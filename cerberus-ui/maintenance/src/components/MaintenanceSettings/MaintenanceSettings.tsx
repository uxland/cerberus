import {CustomButton} from "@cerberus/core";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {MaintenanceSettings as MaintenanceSettingsModel} from "../../features/filters/view-camera-maintenance-settings/model.ts";
import {MaintenanceMode} from "../../features/model.ts";
import {useMaintenanceLocales} from "../../locales/ca/locales.ts";
import {MaintenanceFilterSettingsItem} from "../MaintenanceFilterSettingsItem/MaintenanceFilterSettingsItem.tsx";
export const MaintenanceSettings = ({
  settings,
  cameraId,
}: {
  settings: MaintenanceSettingsModel;
  cameraId: string;
}) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<string>(MaintenanceMode.Training);

  useEffect(() => {
    setMode(MaintenanceMode.Training);
  }, [cameraId, settings]);

  const toggleMode = () => {
    setMode((prevMode) =>
      prevMode === MaintenanceMode.Training
        ? MaintenanceMode.Production
        : MaintenanceMode.Training
    );
  };

  const handleCalibration = (filterId: string) => {
    navigate(
      `/maintenance/camera-settings/${cameraId}/calibrate-filter/${filterId}`
    );
  };

  const switchedMode =
    mode === MaintenanceMode.Training
      ? MaintenanceMode.Production
      : MaintenanceMode.Training;
  const switchedModeLabel = useMaintenanceLocales(
    `maintenanceSettings.type.${switchedMode}`
  );

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col h-30 justify-between bg-tableBg w-full p-5 rounded-[10px] gap-4">
        <div className="flex h-full p-0 gap-4">
          <Typography className="flex items-center">
            {useMaintenanceLocales("maintenanceSettings.status")}:{" "}
            {useMaintenanceLocales(`maintenanceSettings.type.${mode}` as any)}
          </Typography>
          <CustomButton
            label={
              useMaintenanceLocales("maintenanceSettings.changeType") +
              " " +
              switchedModeLabel
            }
            onClick={toggleMode}
            color={"primary"}
            textSize={"xs"}
          />
        </div>
        {Object.keys(settings?.analysisFiltersArgs).length > 0 ? (
          Object.keys(settings.analysisFiltersArgs).map((key, index) => {
            const filter = settings.analysisFiltersArgs[key];
            return (
              <MaintenanceFilterSettingsItem
                key={key}
                filter={filter}
                index={key}
                handleCalibration={handleCalibration}
                filterTextLabel={useMaintenanceLocales(
                  "maintenanceSettings.filter"
                )}
                calibrateLabel={useMaintenanceLocales(
                  "maintenanceSettings.calibrate"
                )}
              />
            );
          })
        ) : (
          <Typography>
            {useMaintenanceLocales("maintenanceSettings.noFilters")}
          </Typography>
        )}
      </div>
    </div>
  );
};
