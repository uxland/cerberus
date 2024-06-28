import {getImageUrl, nop} from "@cerberus/core";
import {Mediator} from "mediatr-ts";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {MaintenanceIssueDetail} from "./model.ts";
import {Query} from "./query.ts";

export const MaintenanceIssuePage = () =>{
    const {id} = useParams();
    const [issue, setIssue] = useState<MaintenanceIssueDetail>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(undefined);
    useEffect(() => {
        async function fetchData() {
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
        fetchData().then(nop);
    }, [id]);

    return (
        <div>
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            {issue && IssueComponent(issue)}
        </div>
    )
}

const IssueComponent = (issue: MaintenanceIssueDetail) => (
    <div>
        <div>Id: {issue.id}</div>
        <img src={getImageUrl(issue.snapshotUrl)} alt={issue.cameraDescription}/>
        <form>

        </form>
    </div>
);