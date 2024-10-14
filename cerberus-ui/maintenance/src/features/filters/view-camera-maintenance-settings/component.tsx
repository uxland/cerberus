import {CameraMaintenanceSettings} from "./model.ts";
import {useEffect, useState} from "react";
import {Mediator} from "mediatr-ts";
import GetCameraMaintenanceSettings from "./query.ts";
import {nop} from "@cerberus/core";

export const MaintenanceSettingsView = (props: {id: string}) => {
    const [settings, setSettings] = useState<CameraMaintenanceSettings | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const query = new GetCameraMaintenanceSettings(props.id, setSettings, setError, setLoading);
        new Mediator().send(query).then(nop);
    }, [props]);
    return (
        <div>
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            {settings && MaintenanceSettingsComponent(settings)}
        </div>
    );
}

const MaintenanceSettingsComponent = (settings: CameraMaintenanceSettings) => (
    <div className="flex flex-col gap-10" />
)

