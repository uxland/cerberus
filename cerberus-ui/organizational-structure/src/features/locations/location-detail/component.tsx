import {useParams} from 'react-router-dom';
import {LocationSettingsView} from "./show-location-settings/component.tsx";

export const LocationPage = () =>{
    const {id} = useParams();
    return (
        <div>
            <LocationSettingsView id={id}/>
        </div>
    )
}