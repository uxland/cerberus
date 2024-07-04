import {getImageUrl, nop} from '@cerberus/core';
import {Mediator} from 'mediatr-ts';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {TrainingReview} from './model.ts';
import {Query} from './query.ts';

export const FulfillTrainingReview = () => {
  const {id} = useParams();
  const [trainingReview, setTrainingReview] =
    useState<TrainingReview>(undefined);
  const [error, setError] = useState<string>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initBusyIndicator = () => {
      setTrainingReview(undefined);
      setLoading(true);
      setError(undefined);
    };
    const fetchReview = async () => {
      try {
        initBusyIndicator();
        const review = await new Mediator().send<TrainingReview>(new Query(id));
        setTrainingReview(review);
      } catch (e) {
        setError(e.toString);
      } finally {
        setLoading(false);
      }
    };
    fetchReview().then(nop);
  }, [id]);
  return (
    <div>
      {loading && <div>loading</div>}
      {error && <div>error</div>}
      {trainingReview && (
        <div>
          <h3>{trainingReview.description}</h3>
          <img
            src={getImageUrl(trainingReview.captureInfo.snapshotUri)}
            alt={trainingReview.description}
          />
          <form onSubmit={}></form>
        </div>
      )}
    </div>
  );
};
