import {CustomButton, InputField, nop, Slider} from "@cerberus/core";
import {Typography} from "@mui/material";
import {Mediator} from "mediatr-ts";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useMaintenanceLocales} from "../../../locales/ca/locales.ts";
import {
  calibrateResultMock,
  filterToCalibrateMock,
} from "../../../mocks/calibrateCameraFilter.ts";
import {HeaderBar} from "../../../ui-components/index.ts";
import {CalibrationResultItem} from "../../../ui-components/maintenance-filter-calibration-item/component.tsx";
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CalibrationResult[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    new Mediator()
      .send(
        new GetCameraFilterArgs(
          cameraId,
          filterId,
          setDetail,
          setLoading,
          setError
        )
      )
      .then(nop);
  }, [cameraId, filterId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const command = new SetCameraFilterArgs(
      cameraId,
      filterId,
      detail.args,
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
      detail.args,
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
      <div className="flex flex-col gap-6">
        <div className="flex gap-4">
          <div className="flex gap-8">
            <InputField
              key={"Nº captures"}
              title={useMaintenanceLocales(
                "maintenanceSettings.calibrateCameraFilters.captureNumber.title"
              )}
              // value={detail?.args?.[arg]}
              classes="!gap-4 !font-bold !max-h-[10px] "
              onChange={(e) => {
                console.log(e.target.value);
              }}
            />
            {Object.keys(filterToCalibrateMock["args"]).map((arg) => (
              <InputField
                key={arg}
                title={arg}
                value={detail?.args?.[arg]}
                classes="!gap-4 !font-bold"
                onChange={(e) => {
                  setDetail({
                    ...detail,
                    args: {
                      ...detail?.args,
                      [arg]: e.target.value,
                    },
                  });
                }}
              />
            ))}
            <div className={`flex flex-col flex-1 justify-end`}>
              <CustomButton
                label={useMaintenanceLocales("maintenanceSettings.calibrate")}
                onClick={handleCalibration}
                color={"primary"}
                textSize={"xs"}
              />
            </div>
          </div>
        </div>
        <div className="flex mt-4">
          <CalibrationSlider
            key={"slider"}
            results={calibrateResultMock}
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
          key={index}
          result={result}
          cameraId={cameraId}
        />
      ))}
    </Slider>
  );
};
