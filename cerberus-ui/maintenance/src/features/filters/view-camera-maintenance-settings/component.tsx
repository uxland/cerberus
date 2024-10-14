import {nop} from "@cerberus/core";
import {Button, Typography} from "@mui/material";
import {Mediator} from "mediatr-ts";
import {useEffect, useState} from "react";
import {useMaintenanceLocales} from "../../../locales/ca/locales.ts";
import {maintenanceCameraSettingsMock} from "../../../mocks/maintenanceCameraSettings.ts";
import {MaintenanceMode} from "../../model.ts";
import {CameraMaintenanceSettings} from "./model.ts";
import GetCameraMaintenanceSettings from "./query.ts";

export const MaintenanceSettingsView = (props: {id: string}) => {
  const [settings, setSettings] = useState<CameraMaintenanceSettings | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [mode, setMode] = useState<string>(MaintenanceMode.Training);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const query = new GetCameraMaintenanceSettings(
      props.id,
      setSettings,
      setError,
      setLoading
    );
    new Mediator().send(query).then(nop);
    console.log(props);
  }, [props]);

  useEffect(() => {
    console.log(mode);
  }, [mode]);

  return (
    <div>
      {/* {loading && <div>Loading.</div>}
      {error && <div>Error: {error}</div>} */}
      {/* {settings && MaintenanceSettingsComponent(settings)} */}
      {MaintenanceSettingsComponent(settings, mode, setMode)}
    </div>
  );
};

const MaintenanceSettingsComponent = (
  settings: CameraMaintenanceSettings,
  mode: string,
  setMode: (mode: string) => void
) => {
  const handleModeChange = () => {
    mode === MaintenanceMode.Training
      ? setMode(MaintenanceMode.Production)
      : setMode(MaintenanceMode.Training);
  };

  const modeText =
    mode === MaintenanceMode.Training
      ? MaintenanceMode.Production
      : MaintenanceMode.Training;
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col h-30 justify-between bg-tableBg w-full p-5 rounded-[10px] gap-4">
        <div className="flex h-full p-0 gap-4">
          <Typography className="flex items-center">
            {useMaintenanceLocales("maintenanceSettings.status")}:{" "}
            {useMaintenanceLocales(`maintenanceSettings.type.${mode}` as any)}
          </Typography>
          <Button
            variant="contained"
            size="small"
            type="submit"
            fullWidth
            className="!rounded-2xl !text-xs !max-w-48 !bg-[primary]"
            onClick={handleModeChange}>
            {useMaintenanceLocales("maintenanceSettings.changeType") +
              " " +
              useMaintenanceLocales(`maintenanceSettings.type.${modeText}`)}
          </Button>
        </div>
        {maintenanceCameraSettingsMock.map((filter) => (
          <div key={filter.description}>
            <div className="flex gap-2">
              <Typography>
                {useMaintenanceLocales("maintenanceSettings.filter")}{" "}
                {filter.description.charAt(0).toUpperCase() +
                  filter.description.slice(1)}{" "}
                :
              </Typography>
              <div className="flex gap-2">
                {Object.keys(filter.args).map((key, index) => (
                  <Typography key={key}>
                    {key}: {filter.args[key]}{" "}
                    {index === Object.keys(filter.args).length - 1 ? "" : "|"}
                  </Typography>
                ))}
              </div>
              <div className="flex ml-2">
                <Typography color={"primary"}>
                  {useMaintenanceLocales("maintenanceSettings.calibrate")}
                </Typography>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
