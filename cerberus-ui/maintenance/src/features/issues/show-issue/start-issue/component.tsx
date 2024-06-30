import {useState} from "react";
import {Mediator} from "mediatr-ts";
import {Command} from "./command.ts";

export const StartIssueForm = (props: {issueId: string}) => {
    const {issueId} = props;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await new Mediator().send(new Command(issueId));
            setSuccess(true);
        } catch (e) {
            setError(e);
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <button type="submit" disabled={isSubmitting}>
                    Open Issue
                </button>
            </div>
            {error && <div>{error}</div>}
            {success && <div>Issue opened</div>}
        </form>
    );
}