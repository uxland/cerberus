import { useEffect, useState } from "react";
import { HierarchyItemType } from "../../../state/hierarchy-item.ts";
import { LocationSettings } from "./model.ts";
import { GetLocationSettings } from "./query.ts";
import { Box, CircularProgress } from "@mui/material";
import { ErrorView, sendMediatorRequest } from "@cerberus/core";
import { useOrganizationalStructureLocales } from "../../../../locales/ca/locales.ts";

export const LocationSettingsView = (props: {
  id: string;
  type: HierarchyItemType;
  content: (settings: LocationSettings) => JSX.Element;
  onFetchComplete?: (settings: LocationSettings) => void;
}) => {
  const error403 = useOrganizationalStructureLocales("location.settings.errors.403");
  const error500 = useOrganizationalStructureLocales("location.settings.errors.500");

  const [settings, setSettings] = useState<LocationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchSettings = () => {
    setError(undefined);
    sendMediatorRequest({
      command: new GetLocationSettings(props.id, props.type),
      setBusy: setLoading,
      setError: setError,
      setState: setSettings
    });
  }

  useEffect(() => {
    fetchSettings();
    if (props.onFetchComplete && settings) {
      props.onFetchComplete(settings as LocationSettings);
    }
  }, [props.id, props.type]);

  if (error) {
    return (
      <ErrorView
        error={error}
        onRefresh={fetchSettings}
        customMessages={{
          403: error403,
          500: error500
        }}
      />
    );
  }

  return (
    <>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      ) : settings ? props.content(settings) : null}
    </>
  );
};
