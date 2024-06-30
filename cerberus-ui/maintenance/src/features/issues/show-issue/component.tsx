import {getImageUrl, nop} from "@cerberus/core";
import {Mediator} from "mediatr-ts";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {MaintenanceIssueDetail} from "./model.ts";
import {Query} from "./query.ts";
import {MaintenanceIssueStatus} from "../model.ts";
import {StartIssueForm} from "./start-issue/component.tsx";
import {CloseIssueForm} from "./close-issue/component.tsx";

export const MaintenanceIssuePage = () =>{
    const {id} = useParams();
    const [issue, setIssue] = useState<MaintenanceIssueDetail>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(undefined);

    useEffect(() => {
        const fetchIssue = async () => {
            try {
                setLoading(true)
                setError(undefined)
                const issue = await new Mediator().send(new Query(id));
                setIssue(issue);
            }catch (e) {
                setError(e.message);
            }
            finally {
                setLoading(false);
            }

        }
        fetchIssue().then(nop);
    }, [id]);

    return (
        <div>
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            {issue && IssueComponent({issue})}
        </div>
    )
}

const IssueComponent = (props: {issue: MaintenanceIssueDetail }) =>{
    const {issue} = props;
    return (<div>
        <div>Id: {issue.id}</div>
        <img src={getImageUrl(issue.snapshotUrl)} alt={issue.cameraDescription}/>
        {issue.status === MaintenanceIssueStatus.open && <StartIssueForm issueId={issue.id} />}
        {issue.status === MaintenanceIssueStatus.inProgress && <CloseIssueForm issueId={issue.id} />}
    </div>
)}