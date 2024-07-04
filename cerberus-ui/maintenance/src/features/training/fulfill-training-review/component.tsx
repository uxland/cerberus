import {getImageUrl, nop} from '@cerberus/core';
import {
  Divider,
  FormControlLabel,
  FormGroup,
  Paper,
  Switch,
  Typography,
} from '@mui/material';
import {Mediator} from 'mediatr-ts';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {FilterResult} from '../../issues/show-issue/model.ts';
import {GetPendingTrainingReview} from './getPendingTrainingReview.ts';
import {TrainingReview} from './model.ts';

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
        let review = await new Mediator().send<TrainingReview>(
          new GetPendingTrainingReview(id)
        );
        const jsonString =
          '{"id": "1de91ca1-4638-43e2-8490-5f16922eda35", "status": "Pending", "revision": null, "createdAt": "2024-07-04T13:30:04.2782655Z", "execution": null, "cameraPath": "CAT>GIR>CAM2", "captureInfo": {"cameraId": "CAM2", "captureId": "26db171d-47d9-44f8-b4c8-46ba8d7b5bd8", "cameraPath": "CAT>GIR>CAM2", "snapshotUri": "CAT/GIR/CAM2/1720099800484/snapshot.bmp"}, "description": "Catalunya>Girona>Càmera2", "fixedResults": null, "originalResults": {"maintenance-blurry-detection-script": {"at": "2024-07-04T13:30:02.4718457Z", "result": true, "isError": false, "filterId": "maintenance-blurry-detection-script", "isSuccess": true, "elapsedTime": "0:00:01.1499327", "errorMessage": "", "filterDescription": "Blurry image detection"}, "maintenance-no-blobs-detection-script": {"at": "2024-07-04T13:30:02.4718145Z", "result": true, "isError": false, "filterId": "maintenance-no-blobs-detection-script", "isSuccess": true, "elapsedTime": "0:00:01.420426", "errorMessage": "", "filterDescription": "No blobs detection"}}, "analysisFailures": null}';
        const analysisResult: TrainingReview = JSON.parse(jsonString);
        console.log();

        setTrainingReview(analysisResult);
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
          <form onSubmit={() => console.log('Submit')}>
            <div className='flex flex-col gap-4'>
              {Object.keys(props.trainingReview.originalResults).map((key) => {
                const result = props.trainingReview.originalResults[key];
                return (
                  <FilterReviewForm
                    key={key}
                    result={result}
                    onChange={() => console.log('test')}
                  />
                );
              })}
            </div>
          </form>
        </Paper>
      </div>
    </div>
  );
};

const FilterReviewForm = (props: {
  result: FilterResult;
  onChange: ({agree: boolean, comment: string}) => void;
}) => {
  return (
    <div className='flex gap-8 items-center justify-end w-86 h-12 p-4'>
      <Typography className='body'>{props.result.filterDescription}</Typography>
      <FormGroup>
        <FormControlLabel
          control={<Switch />}
          label='Agree'
          labelPlacement='start'
          className='gap-4'
        />
      </FormGroup>
    </div>
  );
};
