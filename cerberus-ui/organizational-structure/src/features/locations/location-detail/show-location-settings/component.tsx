import {Button, Typography} from "@mui/material";
import {Mediator} from "mediatr-ts";
import {useEffect, useState} from "react";
import {CaptureSnapshots} from "../../../capture-snapshot/command.ts";
import {HierarchyItemType} from "../../../state/hierarchy-item.ts";
import {LocationSettings} from "./model.ts";
import {GetLocationSettings} from "./query.ts";

export const LocationSettingsView = (props: {
  id: string;
  type: HierarchyItemType;
}) => {
  const [settings, setSettings] = useState<LocationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const settings = await new Mediator().send(
          new GetLocationSettings(props.id, props.type)
        );
        setSettings(settings);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData().then(() => console.log("done"));
  }, [props]);
  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {settings && LocationSettingsComponent(settings)}
    </div>
  );
};

const LocationSettingsComponent = (settings: LocationSettings) => {
  const capture = () => new Mediator().send(new CaptureSnapshots(settings.id));
  return (
    <div className="flex justify-between">
      <Typography variant="h2" color="#fff">
        {settings.path} ({settings.description})
      </Typography>
      <Button
        variant="outlined"
        className="capture-btn"
        aria-label="Capture"
        onClick={capture}>
        Capture Me
      </Button>
    </div>
  );
};
