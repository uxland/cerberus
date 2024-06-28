import {Capture} from "./model.ts";
import {useEffect, useState} from "react";
import {ListCapturesByCameraId} from "./query.ts";
import {Mediator} from "mediatr-ts";
import {nop} from "@cerberus/core";

export const CameraCapturesView = (props: {id: string}) =>{
    const [captures, setCaptures] = useState<Capture[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(undefined);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                const captures = await new Mediator().send(new ListCapturesByCameraId(props.id));
                setCaptures(captures);
            }
            catch (e) {
                setError(e.message);
            }
            finally {
                setLoading(false);
            }
        }
        fetchData().then(nop);
    }, [props]);
    return (
        <div>
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            {captures && CaptureListComponent(captures)}
        </div>
    )
}

const CaptureListComponent = (captures: Capture[]) => (
    <div>
        <h1>Captures</h1>
        <ul>
            {captures.map(capture => CaptureComponent(capture))}
        </ul>

    </div>
)
const CaptureComponent = (capture: Capture) => (
    <div>
        <div>At: {capture.at.toString()}</div>
        <div>Camera: {capture.cameraId}</div>
        <img src={getImageUrl(capture.thumbnailPath)} alt={capture.cameraId}/>
        <div>Successful: {capture.successful ? 'Yes' : 'No'}</div>
        {capture.error && <div>Error: {capture.error.message}</div>}
    </div>
);

// @ts-ignore
const urlBase = import.meta.env.VITE_CERBERUS_BACKEND_URL
const getImageUrl= (url: string) =>{
    return `${urlBase}/images/${url}`;
}