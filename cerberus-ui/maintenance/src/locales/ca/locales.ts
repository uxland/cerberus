import { getNestedValue } from "@cerberus/core";
import { Paths } from "@cerberus/core/src/utils/auxiliar-types";
import { useLocalePath } from "@uxland/react-services";
import { moduleName } from "../../constants";

export type MaintenanceLocalesPath = Paths<(typeof locales)[typeof moduleName]>;
export const useMaintenanceLocales = (
  path: MaintenanceLocalesPath,
  type?: string
) => {
  const localePath = useLocalePath();
  const locale = getNestedValue(locales[moduleName], path);

  if (!locale) {
    console.error(`Locale path "${path}" not found in locales.`);
    return "";
  }
  return localePath(locale);
};

export const locales = {
  [moduleName]: {
    title: {
      pendingReviews: "Revisions Pendents",
      openIssues: "Actives",
      summaryChart: "Últims reports",
      errorsChart: "Últims reports",
      rounds: "Rondes",
    },
    openIssuesTabs: {
      table: "Taula",
      chart: "Gràfic",
    },
    pendingReviewsTabs: {
      table: "Taula",
      chart: "Gràfic",
    },
    pendingReviewsTable: {
      id: "Identificador",
      preview: "Preview",
      date: "Data",
      location: "Localització",
      Description: "Description",
      Actions: "Accions",
    },
    openIssuesTable: {
      cameraId: "Identificador",
      status: "Estat",
      errorCode: "Codi",
      date: "Data",
      summary: "Resum",
      location: "Localització",
      Actions: "Accions",
    },
    roundsTable: {
      roundId: "Identificador",
      description: "Descripció",
      lastExecution: "Última exec",
      lastDuration: "Última duració",
      nextExecution: "Següent execució",
      group: "Grup",
      Actions: "Accions",
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
    maintenanceSettings: {
      title: "Configuració Manteniment",
      status: "Estat",
      calibrate: "Calibrar",
      calibrateCameraFilters: {
        title: "Calibratge de filtre",
        camera: "Càmara",
        filter: "Filtre",
        captureNumber: {
          title: "Nº Captures",
        },
      },
      calibrateItem: {
        original: "Original",
        calibrated: "Transformada",
      },
      changeType: "Canviar a ",
      filter: "Filtre",
      noFilters: "No hi ha filtres disponibles",
      onSubmit: "Guardar Paràmetres",
      type: {
        training: "Manteniment",
        production: "Producció",
      },
    },
  },
};
