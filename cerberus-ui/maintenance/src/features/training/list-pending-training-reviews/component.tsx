import {PendingTrainingReview} from "./model.ts";
import {useEffect, useState} from "react";
import {nop} from "@cerberus/core";
import {Mediator} from "mediatr-ts";
import {ListPendingReviewsByLocation} from "./query.ts";

export const PendingTrainingReviewsView = (props: {id: string}) => {
    const [reviews, setReviews] = useState<PendingTrainingReview[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        async function fetchReviews() {
            try {
                setError(undefined)
                setLoading(true)
                const reviews = await new Mediator().send(new ListPendingReviewsByLocation(props.id))
                setReviews(reviews)
            }
            catch (e){
                setError(e.message)
            }
            finally {
                setLoading(false)
            }
        }
        fetchReviews().then(nop)

    }, [props]);

    return (
        <div>
            <h1>Pending Training Reviews</h1>
            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}
            <ul>
                {reviews.map((review) => (
                    <li key={review.id}>
                        <div>{review.description}</div>
                        <div>{review.createdAt}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}