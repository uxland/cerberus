import {getImageUrl, nop} from '@cerberus/core';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import Typography from '@mui/material/Typography';
import {Mediator} from 'mediatr-ts';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {CustomTextArea} from '../../../ui-components/text-area/component.tsx';
import {FilterResult} from '../../issues/show-issue/model.ts';
import {FulfillTrainingReview} from './command.ts';
import {GetPendingTrainingReview} from './get-pending-training-review.ts';
import {
  FilterResultReview,
  TrainingReview,
  initialFilterResultReview,
  isValidReview,
  updateTrainingReviewResult,
} from './model.ts';

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
  const [reviewResult, setReviewResult] = useState(
    initialFilterResultReview(props.trainingReview)
  );
  const [canSend, setCanSend] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>(undefined);
  const setFilterResult = (filterId: string, result: FilterResultReview) => {
    const updateReviewResult = updateTrainingReviewResult(
      reviewResult,
      filterId,
      result
    );
    setReviewResult(updateReviewResult);
    setCanSend(isValidReview(updateReviewResult));
  };

  const fullfillReview = async (e: Event) => {
    try {
      e.preventDefault();
      setError(undefined);
      setIsSubmitting(true);
      await new Mediator().send(
        new FulfillTrainingReview(props.trainingReview.id, reviewResult)
      );
    } catch (e) {
      setError(e.message || e.toString);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex flex-col w-full gap-6'>
      <h3>{props.trainingReview.description}</h3>
      <div className=' w-full justify-between grid grid-cols-1 gap-8 2xl:grid-cols-2 2xl:gap-96'>
        <div className='w-[1000px] rounded-[10px] overflow-hidden'>
          <img
            src={getImageUrl(props.trainingReview.captureInfo.snapshotUri)}
            alt={props.trainingReview.description}
            className='w-full h-full object-cover'
          />
        </div>
        <Paper className='custom-table p-4'>
          <div className='flex flex-col mb-4'>
            <Typography className='!text-lg'>Review results</Typography>
            <Divider orientation='horizontal' className='bg-gray-300 !h-0' />
          </div>
          <form
            onSubmit={() => fullfillReview}
            className='flex flex-col w-full gap-4 p-6 items-end'>
            <div className='flex flex-col gap-6 w-full'>
              {Object.keys(reviewResult).map((key) => {
                const result = reviewResult[key];
                const originalResult =
                  props.trainingReview.originalResults[key];
                return (
                  <>
                    <FilterReviewForm
                      key={key}
                      originalResult={originalResult}
                      currentResult={result}
                      onChange={(result: FilterResultReview) =>
                        setFilterResult(key, result)
                      }
                    />
                    {result.agreement === false ? (
                      <TextArea
                        key={key}
                        result={result}
                        onChange={(result: FilterResultReview) =>
                          setFilterResult(key, result)
                        }
                      />
                    ) : null}
                  </>
                );
              })}
            </div>
            <div className='flex items-end'>
              <Button
                variant='contained'
                color='primary'
                size='small'
                disabled={!canSend}
                type='submit'
                fullWidth
                className='submit-btn !max-w-48'
                onClick={() => fullfillReview}>
                Submit
              </Button>
            </div>
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
  const agree = () =>
    props.onChange({agreement: true, comment: props.currentResult.comment});
  const disagree = () =>
    props.onChange({agreement: false, comment: props.currentResult.comment});

  const getStyles = (isAgreement, isError) => {
    if (isAgreement) return '!text-success !border-success';
    if (isError) return '!text-error !border-error';
    return '!text-gray-300 !border-gray-300 opacity-40';
  };

  const {agreement} = props.currentResult;
  const isAgreementTrue = agreement === true;
  const isAgreementFalse = agreement === false;
  const successSelectedStyles = getStyles(isAgreementTrue, false);
  const errorSelectedStyles = getStyles(false, isAgreementFalse);

  return (
    <div className='flex w-full justify-between'>
      <Typography className='body'>
        {props.originalResult.filterDescription}
      </Typography>
      <FormGroup className='flex flex-col'>
        <FormControlLabel
          control={
            <div className='flex flex-col gap-4'>
              <div className='flex gap-4'>
                <ToggleButton
                  selected={props.currentResult.agreement === true}
                  value='Agree'
                  onClick={agree}
                  size='small'
                  className={successSelectedStyles}>
                  Agree
                </ToggleButton>
                <ToggleButton
                  selected={props.currentResult.agreement === false}
                  value='Disagree'
                  size='small'
                  onClick={disagree}
                  className={errorSelectedStyles}>
                  Disagree
                </ToggleButton>
              </div>
            </div>
          }
          label={props.originalResult.result === true ? 'Si' : 'No'}
          labelPlacement='start'
          className='gap-4'
        />
      </FormGroup>
    </div>
  );
};

const TextArea = (props: {
  onChange: (result: FilterResultReview) => void;
  result: FilterResultReview;
}) => {
  const setComment = (comment: string) =>
    props.onChange({agreement: props.result.agreement, comment});
  const handleChange = (event) => {
    const comment = event.target.value;
    setComment(comment);
  };
  return <CustomTextArea onChange={handleChange} />;
};
