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
      // pendingReviews: "Pendientes",
      // openIssues: "Pendientes",
      summaryChart: "Últimos reportes",
      errorsChart: "Últimos reportes",
      rounds: "Rondas",
    },
    openIssuesTabs: {
      table: "Activas",
      chart: "Gráficos",
    },
    pendingReviewsTabs: {
      table: "Revisiones Pendientes",
      chart: "Gráficos",
    },
    pendingReviewsTable: {
      id: "Identificador",
      preview: "Vista previa",
      date: "Fecha",
      location: "Localización",
      Description: "Descripción",
      Actions: "Acciones",
    },
    openIssuesTable: {
      cameraId: "Identificador",
      status: "Estado",
      errorCode: "Código",
      date: "Fecha",
      summary: "Resumen",
      location: "Localización",
      Actions: "Acciones",
    },
    openIssuesForm: {
      title: "Error de la Descripción",
      resolutionTime: "Tiempo de Resolución",
      notification: {
        open: {
          onSuccess: "Incidencia abierta correctamente",
          onError: "Error al abrir incidencia",
        },
        close: {
          onSuccess: "Incidencia cerrada correctamente",
          onError: "Error al cerrar incidencia",
        },
      },
    },
    trainingReviewForm: {
      notification: {
        onSuccess: "Datos enviados correctamente",
        onError: "Error al enviar datos",
      },
    },
    maintenanceSettings: {
      title: "Configuración Mantenimiento",
      status: "Estado",
      calibrate: "Calibrar",
      calibrateCameraFilters: {
        title: "Calibración de filtro",
        camera: "Cámara",
        filter: "Filtro",
        captureNumber: {
          title: "Nº Capturas",
        },
      },
      calibrateItem: {
        original: "Original",
        calibrated: "Transformada",
      },
      changeType: "Cambiar a ",
      filter: "Filtro",
      noFilters: "No hay filtros disponibles",
      onSubmit: "Guardar Parámetros",
      type: {
        training: "Mantenimiento",
        production: "Producción",
      },
    },
  },
};