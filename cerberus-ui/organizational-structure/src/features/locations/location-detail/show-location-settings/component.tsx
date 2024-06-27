import {Settings} from "./model.ts";
import {useEffect, useState} from "react";
import {Mediator} from "mediatr-ts";
import {GetLocationSettings} from "./query.ts";

export const LocationSettingsView = (props: {id: string}) =>{
    const [settings, setSettings] = useState<Settings | null>({});
    useEffect(() => {
        async function fetchData() {
            const data = await new Mediator().send(new GetLocationSettings(props.id));
            setSettings(data);
        }
        fetchData().then(() => {})
    }, [props.id]);
    return (
        <div>{settings}</div>
    )
}