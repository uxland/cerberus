import { getImageUrl, nop } from "@cerberus/core";

import { ImageComponent } from "@cerberus/maintenance";
import { List, ListItem, Typography, CircularProgress, Box } from "@mui/material";
import { format } from "date-fns/format";
import { Mediator } from "mediatr-ts";
import { useEffect, useState } from "react";
import { Capture } from "./model.ts";
import { ListCapturesByCameraId } from "./query.ts";

export const CameraCapturesView = (props: { id: string }) => {
  const [captures, setCaptures] = useState<Capture[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    new Mediator()
      .send(
        new ListCapturesByCameraId(props.id, setCaptures, setLoading, setError)
      )
      .then(nop);
  }, [props]);
  return (
    <div>
      {loading ? (
        <Box className="flex justify-center items-center">
          <CircularProgress />
        </Box>
      ) : captures ? CaptureListComponent(captures) : null}
      {error && <div>Error: {error}</div>}
    </div>
  );
};

const formatDateString = (dateString) => {
  const date = new Date(dateString);
  return format(date, "dd/MM/yyyy hh:mm:ss a");
};
const CaptureListComponent = (captures: Capture[]) => (
  <div className="flex flex-col gap-4">
    <Typography variant="h5">
      {/*  {useOrganizationalStructureLocales("tabs.reports")} ({captures.length})*/}
    </Typography>
    <List className="grid sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-4 h-full flex-wrap">
      {captures.map((capture) => (
        <ListItem key={capture.id}>{CaptureComponent(capture)}</ListItem>
      ))}
    </List>
  </div>
);
const CaptureComponent = (capture: Capture) => (
  <div className="flex flex-col gap-2 min-w-52">
    <div className="flex flex-col gap-1">
      <Typography variant="body1">
        At: {formatDateString(capture.at)}
      </Typography>
      <Typography variant="body1">
        {/*{useOrganizationalStructureLocales("views.camera")}: {capture.cameraId}*/}
      </Typography>
    </div>
    <div className="flex flex-col gap-2">
      <ImageComponent
        src={getImageUrl(capture.thumbnailPath)}
        alt={capture.cameraId}
        className="image !h-32"
        size="small"
      />
    </div>
  </div>
);
