import {getNestedValue} from "@cerberus/core";
import {Paths} from "@cerberus/core/src/utils/auxiliar-types";
import {useLocalePath} from "@uxland/react-services";
import {moduleName} from "../../constants";

export type MaintenanceLocalesPath = Paths<(typeof locales)[typeof moduleName]>;
export const useMaintenanceLocales = (path: MaintenanceLocalesPath) => {
  const globalPath = useLocalePath();
  const locale = getNestedValue(locales[moduleName], path);

  if (!locale) {
    console.error(`Locale path "${path}" not found in locales.`);
    return "";
  }
  return globalPath(locale);
};

export const locales = {
  [moduleName]: {
    title: {
      pendingReviews: "Revisions Pendents",
      openIssues: "Incidències",
      summaryChart: "Últims reports",
      errorsChart: "Últims reports",
    },
    pendingReviewsTable: {
      id: "Id",
      preview: "Preview",
      date: "Date",
      location: "Location",
      Description: "Description",
      Actions: "Actions",
    },
    openIssuesTable: {
      cameraId: "Id",
      status: "Status",
      errorCode: "Code",
      date: "Date",
      summary: "Summary",
      location: "Location",
      Actions: "Actions",
    },
    openIssuesForm: {
      title: "Error de la Descripció",
      resolutionTime: "Temps de Resolució",
      notification: {
        open: {
          onSuccess: "Incidència oberta correctament",
          onError: "Error en començar inscidència",
        },
        close: {
          onSuccess: "Incidència tancada correctament",
          onError: "Error en tancar incidència",
        },
      },
    },
    trainingReviewForm: {
      notification: {
        onSuccess: "Dades enviades correctament",
        onError: "Error en enviar dades",
      },
    },
  },
};
