import {getImageUrl, nop} from '@cerberus/core';
import {
  Divider,
  FormControlLabel,
  FormGroup,
  Paper, TextareaAutosize,
  ToggleButton,
  Typography,
} from '@mui/material';
import {Mediator} from 'mediatr-ts';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {FilterResult} from '../../issues/show-issue/model.ts';
import {
  FilterResultReview,
  initialFilterResultReview,
  isValidReview,
  TrainingReview, updateTrainingReviewResult
} from './model.ts';
import {FulfillTrainingReview} from "./command.ts";
import {GetPendingTrainingReview} from "./get-pending-training-review.ts";

export const FulfillTrainingReviewPage = () => {
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
        const review = await new Mediator().send<TrainingReview>(
          new GetPendingTrainingReview(id)
        );
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
      {trainingReview && <FiltersReview trainingReview={trainingReview} />}
    </div>
  );
};

const FiltersReview = (props: {trainingReview: TrainingReview}) => {
  const [reviewResult, setReviewResult] = useState(initialFilterResultReview(props.trainingReview));
  const [canSend, setCanSend] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>(undefined);
  const setFilterResult = (filterId: string, result: FilterResultReview) => {
    const updateReviewResult =updateTrainingReviewResult(reviewResult, filterId, result);
    setReviewResult(updateReviewResult)
    setCanSend(isValidReview(updateReviewResult));
  };

  const fullfillReview = async (e: Event) => {
    try {
      e.preventDefault();
      setError(undefined);
      setIsSubmitting(true);
      await new Mediator().send(new FulfillTrainingReview(props.trainingReview.id, reviewResult));
    }
    catch (e){
      setError(e.message || e.toString);
    }
    finally {
      setIsSubmitting(false)
    }

  };

  return (
    <div className='flex flex-col w-full gap-6'>
      <h3>{props.trainingReview.description}</h3>
      <div className='grid grid-cols-2 gap-96 w-full justify-between'>
        <div className='w-[600px] border'>
          <img
            src={getImageUrl(props.trainingReview.captureInfo.snapshotUri)}
            alt={props.trainingReview.description}
          />
        </div>
        <Paper className='custom-table p-4 w-[600px]'>
          <div className='flex flex-col mb-4'>
            <Typography className='!text-lg'>Review results</Typography>
            <Divider orientation='horizontal' className='bg-gray-300 !h-0' />
          </div>
          <form onSubmit={fullfillReview}>
            <div className='flex flex-col gap-4'>
              {Object.keys(reviewResult).map((key) => {
                const result = reviewResult[key];
                const originalResult = props.trainingReview.originalResults[key];
                return (
                  <FilterReviewForm
                    key={key}
                    originalResult={originalResult}
                    currentResult={result}
                    onChange={(result: FilterResultReview) => setFilterResult(key, result)}
                  />
                );
              })}
            </div>
            <button
              type='submit'
              disabled={!canSend}
              className='btn btn-primary'>Submit</button>
          </form>
        </Paper>
      </div>
    </div>
  );
};

const FilterReviewForm = (props: {
  originalResult: FilterResult;
  currentResult: FilterResultReview;
  onChange: (result: FilterResultReview) => void;
}) => {
  const agree = () => props.onChange({agreement: true, comment: props.currentResult.comment});
  const disagree = () => props.onChange({agreement: false, comment: props.currentResult.comment});
  const setComment = (comment: string) => props.onChange({agreement: props.currentResult.agreement, comment});
  return (
    <div className='flex gap-8 items-center justify-end w-86 h-12 p-4'>
      <Typography className='body'>{props.originalResult.filterDescription}</Typography>
      <FormGroup>
        <FormControlLabel
            control={<div>
              <ToggleButton selected={props.currentResult.agreement === true} value="Agree" onClick={agree}>Agree</ToggleButton>
              <ToggleButton selected={props.currentResult.agreement === false} value="Disagree" onClick={disagree}>Disagree</ToggleButton>
            </div>}
          label={props.originalResult.result ? "Ok" : "Not Ok"}
          labelPlacement='start'
          className='gap-4'
        />
      </FormGroup>
    </div>
  );
};
