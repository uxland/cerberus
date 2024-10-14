import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Mediator} from "mediatr-ts";
import {nop} from "@cerberus/core";
import {CalibrateCameraFilter, GetCameraFilterArgs, SetCameraFilterArgs} from "./command.ts";
import {CalibrationResult, CameraFilterDetail} from "./model.ts";


export const CalibrateCameraFilterPage = () => {
    const {cameraId, filterId} = useParams<{cameraId: string, filterId: string}>();
    const [detail, setDetail] = useState<CameraFilterDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<CalibrationResult[] | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        new Mediator().send(new GetCameraFilterArgs(cameraId, filterId, setDetail, setLoading, setError)).then(nop);
    }, [cameraId, filterId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const command = new SetCameraFilterArgs(cameraId, filterId, detail.args, () =>{}, setIsSubmitting, setError);
        new Mediator().send(command).then(nop);
    }

    const handleCalibration = (e) => {
        e.preventDefault();
        const command = new CalibrateCameraFilter(cameraId, filterId, detail.args, setResult, setIsSubmitting, setError);
        new Mediator().send(command).then(nop);
    }

    return (
        <div>
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            <h1>Calibrate Camera Filter</h1>
        </div>
    );
}

