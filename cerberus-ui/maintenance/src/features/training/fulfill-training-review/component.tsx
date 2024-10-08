import {getImageUrl, nop, notificationService} from '@cerberus/core';
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
import {useMaintenanceLocales} from '../../../locales/ca/locales.ts';
import {HeaderBar} from '../../../ui-components/index.ts';
import {ImageComponent} from '../../../ui-components/issue-image/component.tsx';
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

  const successMessage: string = useMaintenanceLocales(
    'trainingReviewForm.notification.onSuccess'
  );
  const errorMessage: string = useMaintenanceLocales(
    'trainingReviewForm.notification.onError'
  );
  const fullfillReview = async (e) => {
    try {
      setError(undefined);
      setIsSubmitting(true);
      await new Mediator().send(
        new FulfillTrainingReview(props.trainingReview.id, reviewResult)
      );
      notificationService.notifySuccess(successMessage);
    } catch (e) {
      setError(e.message || e.toString);
      notificationService.notifySuccess(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex flex-col w-full gap-6'>
      <HeaderBar
        component={<HeaderContent trainingReview={props.trainingReview} />}
      />
      <div className='flex flex-col min-[2100px]:flex-row gap-6 '>
        <div className='max-h-[580px] lg:w-[1200px] rounded-[10px] overflow-hidden'>
          <ImageComponent
            src={getImageUrl(props.trainingReview.captureInfo.snapshotUri)}
            alt={props.trainingReview.description}
            className='w-full object-cover h-[580px]'
          />
        </div>
        <Paper className='custom-table p-4 pb-0 w-[540px] lg:w-full 3xl:w-[580px] 3xl:max-h-[580px]] 3xl:overflow-auto h-max'>
          <div className='flex flex-col mb-4'>
            <Typography className='!text-[16px]'>Review results</Typography>
            <Divider orientation='horizontal' className='bg-gray-300 !h-0' />
          </div>
          <div className='flex flex-col w-full gap-8 p-6 items-end'>
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
                size='small'
                disabled={!canSend}
                fullWidth
                className='!rounded-2xl !w-52 !text-white !bg-[#02bc77]'
                onClick={fullfillReview}>
                Submit
              </Button>
            </div>
          </div>
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
    if (isAgreement)
      return '!text-[12px] !capitalize !text-[#02bc77] !border-[#02bc77]';
    if (isError) return '!text-[12px] !capitalize !text-error !border-error';
    return '!text-[12px] !capitalize !text-gray-300 !border-gray-300 opacity-40';
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
          sx={{
            span: {
              color: `${props.originalResult.result ? '#02bc77' : 'red'}`,
              fontWeight: '800 !important',
              letterSpacing: '1px !important',
              alignItems: 'flex-start !important',
              marginRight: '0px !important',
              '@media (max-width: 2100px)': {
                marginRight: '140px !important',
              },
            },
          }}
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

const HeaderContent = (props: {trainingReview: TrainingReview}) => {
  return (
    <div className='flex gap-4'>
      <div className='flex gap-2'>
        <Typography variant='h5' color='#fff' className='!tracking-widest'>
          {props?.trainingReview.description}
        </Typography>
        <Typography variant='h5' color='#fff'>
          <span className='font-semibold'>12:25:27</span>
        </Typography>
      </div>
    </div>
  );
};
