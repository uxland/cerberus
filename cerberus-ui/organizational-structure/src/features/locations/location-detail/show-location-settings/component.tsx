import {useEffect, useState} from "react";
import {Mediator} from "mediatr-ts";
import {GetLocationSettings} from "./query.ts";
import {LocationSettings} from "./model.ts";
import {HierarchyItemType} from "../../../show-organizational-structure/hierarchy-item.ts";

export const LocationSettingsView = (props: {id: string, type: HierarchyItemType}) =>{
    const [settings, setSettings] = useState<LocationSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(undefined);
    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                const settings = await new Mediator().send(new GetLocationSettings(props.id, props.type));
                setSettings(settings);
            }
            catch (e) {
                setError(e.message);
            }
            finally {
                setLoading(false);

            }
        }
        fetchData().then(() => console.log('done'));
    }, [props]);
    return (
        <div>
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            {settings && LocationSettingsComponent(settings)}
        </div>

    )
}

const LocationSettingsComponent = (settings: LocationSettings) => (
    <div>
        <h1>Settings</h1>
        <div>Location name: {settings.description}</div>
    </div>
)