import {CustomButton} from "@cerberus/core";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {MaintenanceSettings} from "../../features/filters/view-camera-maintenance-settings/model.ts";
import {MaintenanceMode} from "../../features/model";
import {useMaintenanceLocales} from "../../locales/ca/locales";
import {MaintenanceFilterSettingsItem} from "../maintenance-filter-settins-item/maintenance-filter-settings-item";
export const MaintenanceSettingsComponent = ({
  settings,
  cameraId,
}: {
  settings: MaintenanceSettings;
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

  const calibrateLabel = useMaintenanceLocales("maintenanceSettings.calibrate");
  const filterTextLabel = useMaintenanceLocales("maintenanceSettings.filter");
  const noFiltersLabel = useMaintenanceLocales("maintenanceSettings.noFilters");
  const statusLabel = useMaintenanceLocales("maintenanceSettings.status");

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
            {statusLabel}:{" "}
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
          {/* <Button
            variant="contained"
            size="small"
            fullWidth
            className="!rounded-2xl !text-xs !max-w-48 !bg-[primary]"
            onClick={toggleMode}></Button> */}
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
                filterTextLabel={filterTextLabel}
                calibrateLabel={calibrateLabel}
              />
            );
          })
        ) : (
          <Typography>{noFiltersLabel}</Typography>
        )}
      </div>
    </div>
  );
};
