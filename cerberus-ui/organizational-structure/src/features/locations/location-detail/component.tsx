import {useParams, useLocation} from 'react-router-dom';
import {LocationSettingsView} from "./show-location-settings/component";
import {HierarchyItemType} from "../../show-organizational-structure/hierarchy-item";
import {CameraCapturesView} from "./list-camera-captures/component";
import {OpenIssuesView, PendingTrainingReviewsView} from "@cerberus/maintenance";

export const LocationPage = () =>{
    const {id} = useParams();
    const query = new URLSearchParams(useLocation().search);
    const itemType = (query.get('item-type') as HierarchyItemType) || HierarchyItemType.location;
    return (
        <div>
            <LocationSettingsView id={id} type={itemType} />
            <CameraCapturesView id={id} style={{ display: itemType === HierarchyItemType.camera ? 'block' : 'none' }}/>
            <OpenIssuesView id={id}/>
            <PendingTrainingReviewsView id={id}/>
        </div>
    )
}