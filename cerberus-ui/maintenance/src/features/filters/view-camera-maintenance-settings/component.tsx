import { nop } from "@cerberus/core";
import { Mediator } from "mediatr-ts";
import { useEffect, useState } from "react";
import { MaintenanceSettings } from "../../../components/index.ts";
import { CameraMaintenanceSettings } from "./model.ts";
import GetCameraMaintenanceSettings from "./query.ts";
import { Box, CircularProgress } from "@mui/material";

export const MaintenanceSettingsView = (props: { id: string }) => {
  const [settings, setSettings] = useState<CameraMaintenanceSettings | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const query = new GetCameraMaintenanceSettings(
      props.id,
      setSettings,
      setError,
      setLoading
    );
    new Mediator().send(query).then(nop);
  }, [props.id]);

  return (
    <div>
      {loading ? (
        <Box className="flex justify-center items-center">
          <CircularProgress />
        </Box>
      ) : settings ? (
        <MaintenanceSettings settings={settings} cameraId={props.id} />
      ) : null}
      {error && <div>Error: {error}</div>}
    </div>
  );
};
