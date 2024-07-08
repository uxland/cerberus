import {nop} from '@cerberus/core';
import {Mediator} from 'mediatr-ts';
import {useEffect, useState} from 'react';
import {
  PendingReviewTable,
  TrainingReviewsPerformanceList,
} from '../../../ui-components/index.ts';
import {TrainingErrorsChart} from '../../../ui-components/training-errors-chart/component.tsx';
import {PendingTrainingReview} from './model.ts';
import {ListPendingReviewsByLocation} from './query.ts';

export const PendingTrainingReviewsView = (props: {id: string}) => {
  const [reviews, setReviews] = useState<PendingTrainingReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReviews() {
      try {
        setError(undefined);
        setLoading(true);
        const reviews = await new Mediator().send(
          new ListPendingReviewsByLocation(props.id)
        );
        setReviews(reviews);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews().then(nop);
  }, [props]);

  return (
    <>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {reviews && PendingReviewListComponent(reviews)}
    </>
  );
};

const PendingReviewListComponent = (reviews: PendingTrainingReview[]) => {
  return (
    <div className='flex flex-col gap-10'>
      <TrainingReviewsPerformanceList />
      <PendingReviewTable reviews={reviews} />
      <TrainingErrorsChart />
    </div>
  );
};
