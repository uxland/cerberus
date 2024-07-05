import {Entity} from '@cerberus/shared/src';

interface CaptureInfo {
  cameraId: string;
  cameraPath: string;
  captureId: string;
  snapshotUri?: string | undefined;
}

interface TrainingReviewExecution {
  performedBy: string;
  performedAt: Date;
}

interface FilterResult {
  filterName: string;
  filterDescription: string;
  at: Date;
  duration: number;
  result: boolean;
  errorMessage?: string | undefined;
}

enum Status {
  pending = 'Pending',
  completed = 'Completed',
}

export interface FilterResultReview {
  agreement: boolean | undefined;
  comment?: string | undefined;
}
enum AnalysisFailureType {
  falsePositive = 'FalsePositive',
  falseNegative = 'FalseNegative',
}
interface AnalysisFailure {
  filterId: string;
  type: AnalysisFailureType;
  review: FilterResultReview;
}

export interface TrainingReview extends Entity {
  cameraPath: string;
  description: string;
  created: Date;
  captureInfo: CaptureInfo;
  status: Status;
  originalResults: {[key: string]: FilterResult}
  execution?: TrainingReviewExecution | undefined;
  fixedResults: FilterResult[];
  revision?: {[key: string]: FilterResultReview} | undefined;
  analysisFailures?: AnalysisFailure[] | undefined;
}

export interface DetectionScript {
  at: string;
  result: boolean;
  isError: boolean;
  filterId: string;
  isSuccess: boolean;
  elapsedTime: string;
  errorMessage: string;
  filterDescription: string;
}

export interface TrainingReviewResult{
    [key: string]: FilterResultReview;
}

export const initialFilterResultReview = (review: TrainingReview): TrainingReviewResult =>
    Object.keys(review.originalResults).reduce((acc, key) => {
        acc[key] = {agreement: undefined, comment: undefined};
        return acc;
    }, {} as TrainingReviewResult);

export const updateTrainingReviewResult = (currentResult: TrainingReviewResult, filterId: string, result: FilterResultReview) =>
    ({...currentResult, [filterId]: result})

export const isValidReview = (review: TrainingReviewResult): boolean =>
    Object.values(review).every((value) => value.agreement !== undefined);