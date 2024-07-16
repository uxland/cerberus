import {getNestedValue} from '@cerberus/core';
import {Paths} from '@cerberus/core/src/utils/auxiliar-types';
import {useLocalePath} from '@uxland/react-services';
import {moduleName} from '../../constants';

export type MaintenanceLocalesPath = Paths<(typeof locales)[typeof moduleName]>;
export const useMaintenanceLocales = (path: MaintenanceLocalesPath) => {
  const globalPath = useLocalePath();
  const locale = getNestedValue(locales[moduleName], path);

  if (!locale) {
    console.error(`Locale path "${path}" not found in locales.`);
    return '';
  }
  return globalPath(locale);
};

export const locales = {
  [moduleName]: {
    title: {
      pendingReviews: 'Pending reviews',
      openIssues: 'Open issues',
      summaryChart: 'Recent report',
      errorsChart: 'Recent report',
    },
    pendingReviewsTable: {
      id: 'ID',
      preview: 'Preview',
      date: 'Date',
      location: 'Location',
      Description: 'Description',
      Actions: 'Actions',
    },
    openIssuesTable: {
      cameraId: 'ID',
      status: 'Status',
      errorCode: 'Code',
      date: 'Date',
      summary: 'Summary',
      location: 'Location',
      Actions: 'Actions',
    },
    openIssuesForm: {
      title: 'Error description',
      resolutionTime: 'Resolution time',
      notification: {
        open: {
          onSuccess: 'Starting issue',
          onError: 'Error on starting issue',
        },
        close: {
          onSuccess: 'Closed issue',
          onError: 'Error on closing issue',
        },
      },
    },
    trainingReviewForm: {
      notification: {
        onSuccess: 'Succed on opening issue',
        onError: 'Error on opening issue',
      },
    },
  },
};
