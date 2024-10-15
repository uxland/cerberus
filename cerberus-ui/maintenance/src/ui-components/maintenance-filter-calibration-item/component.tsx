import Typography from "@mui/material/Typography";
import {CalibrationResult} from "../../features/filters/calibrate-camera-filter/model";

export const FilterCalibrationItem = (props: {result: CalibrationResult}) => {
  return (
    <div className="flex flex-col bg-tableBg p-8 gap-4">
      <div className="flex items-center justify-between">
        <Typography>Captura X </Typography>
        <Typography>{props?.result.success === true ? "OK" : "KO"}</Typography>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col items-start gap-4">
          <Typography>Original</Typography>
          <img src={props.result.originalImageUrl} alt={"Original"} />
        </div>

        <div className="flex flex-col items-start gap-4">
          <Typography>Calibrada</Typography>
          <img src={props.result.originalImageUrl} alt={"Original"} />
        </div>
      </div>
    </div>
  );
};
