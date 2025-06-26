import { useEffect, useState } from "react";
import { MaintenanceSettings } from "../../../components/index.ts";
import { CameraMaintenanceSettings } from "./model.ts";
import GetCameraMaintenanceSettings from "./query.ts";
import { ErrorView, sendMediatorRequest } from "@cerberus/core";
import { Box, CircularProgress } from "@mui/material";

export const MaintenanceSettingsView = (props: { id: string }) => {
  const [settings, setSettings] = useState<CameraMaintenanceSettings | null>(
    null
  );
  const [busy, setBusy] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMaintenanceSettings = () => {
    sendMediatorRequest({
      command: new GetCameraMaintenanceSettings(props.id),
      setBusy: setBusy,
      setError: setError,
      setState: setSettings
    });
  }

  useEffect(() => {
    fetchMaintenanceSettings();
  }, [props.id]);


  if (error) {
    return (
      <ErrorView
        error={error}
        onRefresh={fetchMaintenanceSettings}
      />
    );
  }

  return (
    <>
      {busy ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      ) : (
        <MaintenanceSettings settings={settings} cameraId={props.id} />
      )}
    </>
  );
};
