import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import Typography from "@mui/material/Typography";
import {CalibrationResult} from "./model.ts";
import {useMaintenanceLocales} from "../../../locales/ca/locales.ts";
import {ImageComponent} from "../../../components";
import {getImageUrl} from "@cerberus/core";
export const CalibrationResultItem = (props: {
  result: CalibrationResult,
  cameraId: string,
}) => {
  return (
    <div className="flex flex-col w-full bg-tableBg p-4">
      <div className="flex flex-1 items-center justify-between mb-2 mt-2">
        <Typography variant="h4" className="!font-bold" color={"primary"}>
        </Typography>
        <Typography variant="h4">
          {props?.result.success === true ? (
            <CheckCircleIcon color="success" />
          ) : (
            <ErrorIcon className="!fill-error" />
          )}
        </Typography>
      </div>
      <div className="flex flex-1 items-center justify-center gap-12">
        <div className="flex flex-col flex-1 gap-4">
          <Typography variant="h6">
            {useMaintenanceLocales(
              "maintenanceSettings.calibrateItem.original"
            )}
          </Typography>
          <div className="rounded-[10px] overflow-hidden">
            <ImageComponent
              src={getImageUrl(props.result.originalImageUrl)}
              alt={"Original"}
              className="w-full object-cover h-[580px] !min-w-80"
            />
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <Typography variant="h6">
            {useMaintenanceLocales(
              "maintenanceSettings.calibrateItem.calibrated"
            )}
          </Typography>
          <div className="rounded-[10px] overflow-hidden">
            <ImageComponent
              src={getImageUrl(props.result.calibratedBase64Image)}
              alt={"transformed"}
              className="w-full object-cover h-[580px] !min-w-80"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
