import {nop} from "@cerberus/core";
import {Typography} from "@mui/material";
import {Mediator} from "mediatr-ts";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {HeaderBar} from "../../../ui-components/index.ts";
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
          <HeaderContent
            cameraId={cameraId}
            filterDescription={"Blurry image detection"}
          />
        }
        close={true}
      />
    </div>
  );
};

const HeaderContent = (props: {
  cameraId?: string;
  filterDescription?: string;
}) => {
  console.log(props);

  //   const filterDescription = props.filterDescription;
  const filterDescription = props.filterDescription;
  return (
    <div className="flex gap-4">
      <div className="flex gap-2">
        <Typography
          variant="body1"
          color="#fff"
          className="!tracking-widest !font-bold">
          Calibratge de filtre
        </Typography>
        <Typography variant="body1" color="#fff" className="!tracking-widest">
          Camera: {props.cameraId}
        </Typography>
        <Typography variant="body1" color="primary" className="!font-bold">
          <span>{filterDescription}</span>
        </Typography>
      </div>
    </div>
  );
};
