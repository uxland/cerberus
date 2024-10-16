import Typography from "@mui/material/Typography";
import {CalibrationResult} from "../../features/filters/calibrate-camera-filter/model";
import {useMaintenanceLocales} from "../../locales/ca/locales";
import {ImageComponent} from "../ImageComponent/ImageComponent";

export const CalibrationResultItem = (props: {
  result: CalibrationResult;
  cameraId: string;
}) => {
  return (
    <div className="flex flex-col bg-tableBg gap-4">
      <div className="flex items-center justify-between">
        <Typography variant="h5">{props.cameraId}</Typography>
        <Typography variant="h5">
          {props?.result.success === true ? "OK" : "KO"}
        </Typography>
      </div>
      <div className="flex items-center justify-between gap-12">
        <div className="flex flex-col items-start gap-4">
          <Typography variant="body1">
            {useMaintenanceLocales(
              "maintenanceSettings.calibrateItem.original"
            )}
          </Typography>
          <div className="rounded-[10px] overflow-hidden">
            <ImageComponent
              src={props.result.originalImageUrl}
              alt={"Original"}
              className="w-full object-cover h-[580px] !min-w-96"
            />
          </div>
          <Typography variant="body1">Arg valor : 78</Typography>
          <Typography variant="body1">Arg valor : 78</Typography>
        </div>
        <div className="flex flex-col items-start gap-4">
          <Typography variant="body1">
            {useMaintenanceLocales(
              "maintenanceSettings.calibrateItem.calibrated"
            )}
          </Typography>
          <div className="rounded-[10px] overflow-hidden">
            <ImageComponent
              src={props.result.originalImageUrl}
              alt={"Original"}
              className="w-full object-cover h-[580px] !min-w-96"
            />
          </div>
          <Typography variant="body1">Arg valor : 78</Typography>
          <Typography variant="body1">Arg valor : 78</Typography>
        </div>
      </div>
    </div>
  );
};
