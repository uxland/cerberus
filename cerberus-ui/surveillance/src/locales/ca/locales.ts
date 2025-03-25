import { getNestedValue } from "@cerberus/core";
import { Paths } from "@cerberus/core/src/utils/auxiliar-types";
import { useLocalePath } from "@uxland/react-services";
import { moduleName } from "../../constants";

export type SurveillanceLocalesPath = Paths<(typeof locales)[typeof moduleName]>;
export const useSurveillanceLocales = (
  path: SurveillanceLocalesPath,
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
    operation: {
      create: {
        title: "Creación de Operativa",
        placeholder: "Añade nombre a tu nueva operativa",
        addOperative: "Añadir operativa",
        preview: "Vista previa",
        proceed: "Proceder",
        question: {
          title: "Pregunta",
          placeholder: "...",
          addQuestion: "+ Añadir pregunta",
          type: "Tipología de respuesta",
          subtype: "Subtipología de respuesta",
          isMandatory: "Obligatoriedad",
          normalityRange: "Rango de normalidad",
          lowerBoundPlaceholder: "Valor mínimo",
          upperBoundPlaceholder: "Valor máximo",
          option: {
            title: "Opción",
            addOption: "+ Añadir opción",
            code: "Código",
            text: "Texto",
            isAnomalous: "Opción anómala",
            delete: "Eliminar",
          }
        },
      },
      table: {
        id: "ID",
        description: "Descripción",
        actions: {
          title: "Acciones",
          delete: "Eliminar",
          edit: "Editar",
          listInspections: "Ver inspecciones",
        }
      }
    },
    round: {
      create: {
        title: "Creación de Ronda",
        placeholder: "Añade un nombre a tu nueva ronda",
        addCamera: "+",
        addGroup: "+",
        cameras: "cámaras",
        groupInput: "Grupo",
        groupAssigned: "Grupo Asignado",
        assignGroup: "Asignar grupo",
        duration: "Duración aproximada de la ronda",
        proceed: "Proceder",
        cronExpressionInput: "Cronología",
        cronExpression: "Ciclo",

        cameraDetails: "Detalles de la cámara",
        cameraName: "Nombre",
        operation: "Operativa",
        streamingUrl: "URL de streaming",
        noOperationAssigned: "Sin operativa asignada",
        assignOperation: "Asignar operativa",
        selectCamera: "Selecciona una cámara",
        cameraId: "Identificador",
        changeOperation: "Cambiar operativa",
      },
      table: {
        id: "ID",
        description: "Descripción",
        assignedTo: "Asignado a",
        cronExpression: "Cronología",
        actions: {
          title: "Acciones",
          edit: "Editar",
          start: "Iniciar",
          delete: "Eliminar",
        }
      },
    },
    run: {
      set: {
        formTitle: "Ronda de Supervisión",
        start: "Empezar ronda de supervisión ahora",
        aditionalComments: "Comentarios adicionales",
        proceed: "Proceder",
        send: "Enviar",
      },
      release: {
        title: "Finalizar Ronda de Supervisión",
        additionalComments: "Comentarios adicionales",
        confirm: "Finalizar Ronda",
        cancel: "Cancelar",
        commentsPlaceholder: "Escribe aquí tus comentarios finales sobre la ronda...",
      },
      details: {
        title: "Detalles de la Ronda",
        startedAt: "Iniciada el",
        inspections: "Inspecciones",
        location: "Ubicación",
        status: "Estado",
        inspectionsCompleted: "Inspecciones completadas",
        id: "ID"
      },
      report: {
        videoTitle: "Grabación de la cámara",
        videoDetails: "Detalles de la grabación",
        cameraLabel: "Cámara",
        durationLabel: "Duración",
        dateLabel: "Fecha",
        notAvailable: "No disponible",
        videoNotSupported: "Tu navegador no soporta la reproducción de videos.",
      },
      anomalyStatuses: {
        normal: "Normal",
        singleAnomaly: "Anomalía detectada",
        multipleAnomalies: "Múltiples anomalías"
      },
      common: {
        notApplicable: "N/A",
      }
    },
  },
};