import {getImageUrl, nop} from '@cerberus/core';
import {Box, FormControl} from '@mui/material';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Paper from '@mui/material/Paper';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import ToggleButton from '@mui/material/ToggleButton';
import Typography from '@mui/material/Typography';
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
          <FormControl
            onSubmit={() => console.log('Submit')}
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
                      <CustomTextArea
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
                onClick={fullfillReview}>
                Submit
              </Button>
            </div>
          </FormControl>
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
          label='Si'
          labelPlacement='start'
          className='gap-4'
        />
      </FormGroup>
    </div>
  );
};

const CustomTextArea = (props: {
  onChange: (result: FilterResultReview) => void;
  result: FilterResultReview;
}) => {
  const setComment = (comment: string) =>
    props.onChange({agreement: props.result.agreement, comment});
  const handleChange = (event) => {
    const comment = event.target.value;
    setComment(comment);
  };
  return (
    <Box
      component={TextareaAutosize}
      onChange={handleChange}
      placeholder='Write a comment...'
      sx={{
        width: '100%',
        backgroundColor: '#313131',
        color: '#d7dadb',
        fontSize: '12px',
        minHeight: '100px',
        padding: '10px',
        '&:focus': {
          borderColor: '#707070',
          outline: 'none',
          boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.25)',
        },
        borderRadius: '6px',
        border: '1px solid #707070',
      }}
    />
  );
};
