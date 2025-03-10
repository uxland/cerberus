import {Inspection, RoundEditionData} from "../domain";

export const RoundInspectionDetail = ({inspection, data}: {inspection: Inspection, data: RoundEditionData}) => {
    return (
        <div>
            <h3>Inspection Detail</h3>
            <p>Inspection ID: {inspection.operationId}</p>
            <p>Inspection Date: {inspection.date}</p>
            <p>Inspection Type: {inspection.type}</p>
            <p>Inspection Status: {inspection.status}</p>
        </div>
    )
}