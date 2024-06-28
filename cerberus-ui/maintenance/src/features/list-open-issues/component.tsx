import {MaintenanceIssue} from "./model.ts";
import {useEffect, useState} from "react";
import {Mediator} from "mediatr-ts";
import {ListOpenIssues} from "./query.ts";
import {nop} from "@cerberus/core";

export const OpenIssuesView = (props: {id: string, type: string}) =>{
    const [issues, setIssues] = useState<MaintenanceIssue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(undefined);
    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                const issues = await new Mediator().send(new ListOpenIssues(props.id));
                setIssues(issues);
            }catch (e) {
                setError(e.message);
            }
            finally {
                setLoading(false);
            }
        }
        fetchData().then(nop);
    }, [props]);
    return (<div/>)
}