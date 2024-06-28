import {useParams, useLocation} from 'react-router-dom';
import {LocationSettingsView} from "./show-location-settings/component.tsx";
import {HierarchyItemType} from "../../show-organizational-structure/hierarchy-item.ts";
import {CameraCapturesView} from "./list-camera-captures/component.tsx";
import {OpenIssuesView} from "@cerberus/maintenance/src/features/list-open-issues/component.tsx";

export const LocationPage = () =>{
    const {id} = useParams();
    const query = new URLSearchParams(useLocation().search);
    const itemType = (query.get('item-type') as HierarchyItemType) || HierarchyItemType.location;
    return (
        <div>
            <LocationSettingsView id={id} type={itemType} />
            {itemType === HierarchyItemType.camera && CameraCapturesView( {id})}
            <OpenIssuesView id={id} type={itemType}/>
        </div>
    )
}