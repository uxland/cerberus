import {useState} from "react";
import {Mediator} from "mediatr-ts";
import {Command} from "./command.ts";

export const CloseIssueForm = (props:{issueId: string}) => {
    const {issueId} = props;
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await new Mediator().send(new Command(issueId, comment));
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
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Comment"
                />
            </div>
            <div>
                <button type="submit" disabled={isSubmitting}>
                    Close Issue
                </button>
            </div>
            {error && <div>{error}</div>}
            {success && <div>Issue closed</div>}
        </form>
    );
}