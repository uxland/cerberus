import {getImageUrl, nop} from '@cerberus/core';
import {Mediator} from 'mediatr-ts';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {TrainingReview} from './model.ts';
import {GetPendingTrainingReview} from './getPendingTrainingReview.ts';
import {FilterResult} from "../../issues/show-issue/model.ts";

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
        const review = await new Mediator().send<TrainingReview>(new GetPendingTrainingReview(id));
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
          <form onSubmit={}>
            {Object.keys(trainingReview.originalResults).forEach((key) => {
              const result = trainingReview.originalResults[key];
              return ()
            })}
          </form>
        </div>
      )}
    </div>
  );
};

const FilterReview = (props: {result: FilterResult, onChange: ({agree: boolean, comment: string}) => void}) => {
  return (
      <div>
        <div>{props.result.filterDescription}</div>

      </div>
  )
}