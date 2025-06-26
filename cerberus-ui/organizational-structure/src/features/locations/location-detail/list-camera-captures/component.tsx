import { sendMediatorRequest, ErrorView } from "@cerberus/core";
import { CircularProgress, Box } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Capture } from "./model.ts";
import { ListCapturesByCameraId } from "./query.ts";
import { CapturesList } from "./components/CapturesList.tsx";

export const CameraCapturesView = ({ id }: { id: string }) => {
  const [captures, setCaptures] = useState<Capture[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchCaptures = useCallback(() => {
    setError(undefined);
    sendMediatorRequest({
      command: new ListCapturesByCameraId(id),
      setBusy: setLoading,
      setError: setError,
      setState: setCaptures,
    });
  }, [id]);

  useEffect(() => {
    fetchCaptures();
  }, [fetchCaptures]);

  if (error) {
    return (
      <ErrorView
        error={error}
        onRefresh={fetchCaptures}
      />
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  return <CapturesList captures={captures || []} />;
};
