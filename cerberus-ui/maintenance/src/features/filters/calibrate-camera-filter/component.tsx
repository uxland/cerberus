import {CustomButton, InputField, nop, Slider} from "@cerberus/core";
import CachedIcon from "@mui/icons-material/Cached";
import {IconButton, Typography} from "@mui/material";
import {Mediator} from "mediatr-ts";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {CalibrationResultItem} from "./calibration-result-item.tsx";
import {HeaderBar} from "../../../components/index.ts";
import {useMaintenanceLocales} from "../../../locales/ca/locales.ts";
import {
  CalibrateCameraFilter,
  GetCameraFilterArgs,
  SetCameraFilterArgs,
} from "./command.ts";
import {CalibrationResult, CameraFilterDetail} from "./model.ts";

export const CalibrateCameraFilterPage = () => {
  const {cameraId, filterId} = useParams<{
    cameraId: string;
    filterId: string;
  }>();
  const [detail, setDetail] = useState<CameraFilterDetail | null>(null);
  const [captureNumber, setCaptureNumber] = useState<number>(1);
  const [currentArgs, setCurrentArgs] = useState<unknown>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CalibrationResult[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() =>{
        loadFilterArgs(cameraId, filterId).then(nop);
        return () => {
          // Cleanup logic here
          console.log('Cleanup function called');
        };
  }

  , [cameraId, filterId]);
  useEffect(() => {
    if(detail) {
      setCurrentArgs(detail.args);
    }
    return () => {
      // Cleanup logic here
      console.log('Cleanup function called');
    };
  }, [detail]);

  const loadFilterArgs = async (cameraId: string, filterId: string) => {
    const query = new GetCameraFilterArgs(cameraId, filterId, setDetail, setLoading, setError);
    await new Mediator().send(query);
  }

  const handleReset = (e) =>{
    e.preventDefault();
    setCurrentArgs(detail?.args);
  } ;
  const handleSubmit = (e) => {
    e.preventDefault();
    const command = new SetCameraFilterArgs(
      cameraId,
      filterId,
      currentArgs,
      () => {},
      setIsSubmitting,
      setError
    );
    new Mediator().send(command).then(nop);
  };

  const handleCalibration = (e) => {
    e.preventDefault();
    const command = new CalibrateCameraFilter(
      cameraId,
      filterId,
      captureNumber,
      currentArgs,
      setResult,
      setIsSubmitting,
      setError
    );
    new Mediator().send(command).then(nop);
  };

  return (
    <div className="flex flex-col w-full gap-6">
      <HeaderBar
        component={
          <HeaderContent cameraId={cameraId} filterDescription={filterId} />
        }
        close={true}
      />
      <div className="flex flex-col flex-1 gap-6">
        <div className="flex gap-8">
          <div className="flex gap-8">
            <InputField
              key={"Nº captures"}
              title={useMaintenanceLocales(
                "maintenanceSettings.calibrateCameraFilters.captureNumber.title"
              )}
              value={captureNumber}
              // value={detail?.args?.[arg]}
              classes="!gap-4 !font-bold !max-h-[10px] "
              onChange={(e) => {
                setCaptureNumber(Number.parseInt(e.target.value));
              }}
            />
            {Object.keys(currentArgs || {}).map((arg) => (
              <InputField
                key={arg}
                title={arg}
                value={currentArgs?.[arg]}
                classes="!gap-4 !font-bold"
                onChange={(e) => {
                  setCurrentArgs(
                      {
                        ...currentArgs,
                        [arg]: Number.parseInt(e.target.value),
                      }
                  );
                }}
              />
            ))}
          </div>
          <div className="flex flex-1 items-end">
            <div className="flex flex-1 items-end gap-6">
              <IconButton className="!p-0 !pb-1" onClick={handleReset}>
                <CachedIcon className="!fill-[#fff]" />
              </IconButton>
              <CustomButton
                label={useMaintenanceLocales("maintenanceSettings.calibrate")}
                onClick={handleCalibration}
                color={"primary"}
                textSize={"xs"}
                padding={"!p-2"}
              />
            </div>
            <div className="flexitems-end">
              <CustomButton
                label={useMaintenanceLocales("maintenanceSettings.onSubmit")}
                onClick={handleSubmit}
                color={"#02bc77"}
                textColor="white"
                textSize={"xs"}
                padding={"!p-2"}
              />
            </div>
          </div>
        </div>
        <div className="flex mt-4">
          <CalibrationSlider
            key={"slider"}
            results={result}
            cameraId={cameraId}
          />
        </div>
      </div>
    </div>
  );
};

const HeaderContent = (props: {
  cameraId?: string;
  filterDescription?: string;
}) => {
  return (
    <div className="flex gap-4">
      <div className="flex gap-2">
        <Typography
          variant="body1"
          color="#fff"
          className="!tracking-widest !font-bold">
          {useMaintenanceLocales(
            "maintenanceSettings.calibrateCameraFilters.title"
          )}
        </Typography>
        <Typography variant="body1" color="#fff" className="!tracking-widest">
          {useMaintenanceLocales(
            "maintenanceSettings.calibrateCameraFilters.camera"
          )}
          : {props.cameraId}
        </Typography>
        <Typography variant="body1" className="!tracking-widest">
          {useMaintenanceLocales(
            "maintenanceSettings.calibrateCameraFilters.filter"
          )}
          :{" "}
        </Typography>
        <Typography variant="body1" color="primary" className="!font-bold">
          {props.filterDescription}
        </Typography>
      </div>
    </div>
  );
};

const CalibrationSlider = ({
  results,
  cameraId,
}: {
  results: CalibrationResult[];
  cameraId: string;
}) => {
  return (
    <Slider>
      {results?.map((result, index) => (
        <CalibrationResultItem
          key={index.toString()}
          result={result}
          cameraId={cameraId}
        />
      ))}
    </Slider>
  );
};
