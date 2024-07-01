import {nop} from '@cerberus/core';
import {Mediator} from 'mediatr-ts';
import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {getIssueUrl, MaintenanceIssueSummary} from './model.ts';
import {ListOpenIssues} from './query.ts';
export const OpenIssuesView = (props: {id: string}) => {
  const [issues, setIssues] = useState<MaintenanceIssueSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(undefined);
        const issues = await new Mediator().send(new ListOpenIssues(props.id));
        setIssues(issues);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData().then(nop);
  }, [props]);
  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {issues && IssueListComponent(issues)}
    </div>
  );
};

const IssueListComponent = (issues: MaintenanceIssueSummary[]) => (
  <div>
    <ul>
      {issues.map((issue) => (
        <li key={issue.id}>{IssueComponent(issue)}</li>
      ))}
    </ul>
  </div>
);
const IssueComponent = (issue: MaintenanceIssueSummary) => (
  <Link to={getIssueUrl(issue)} key={issue.id}>
    <div>Id: {issue.id}</div>
    <div>Description: {issue.description}</div>
    <div>Summary: {issue.summary}</div>
  </Link>
);
