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
        createOperation: "Crear Operativa",
        fixErrorsLabel: "Por favor, corrije los siguientes errores",
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
          triggers: {
            title: "Condiciones",
            add: "+ Añadir condición",
            label: "Condición",
          },
          actions: {
            addAction: "+ Añadir acción",
            addAlternative: "+ Añadir alternativa",
            removeInstruction: "Eliminar",
            anomalousAction: "Acción",
            delete: "Eliminar",
          },
          option: {
            title: "Opción",
            addOption: "+ Añadir opción",
            isAnomalous: "Anómala",
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
        }
      },
      errors: {
        list: {
          403: "No tienes permisos para acceder a las operativas",
          500: "Error al cargar la lista de operativas"
        },
        403: "No tienes permisos para acceder a esta operativa",
        404: "La operativa solicitada no existe o fue eliminada",
        500: "Error al cargar los datos de la operativa"
      }
    },
    round: {
      create: {
        createRound: "Crear Ronda",
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
        deferredExecution: "Ejecución diferida",
        selectAll: "Seleccionar todas las cámaras",
        deselectAll: "Deseleccionar todas las cámaras",
        clipDuration: "Duración del clip",
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
          view: "Ver inspecciones",
        }
      },
      errors: {
        list: {
          403: "No tienes permisos para acceder a las rondas",
          500: "Error al cargar la lista de rondas"
        },
        403: "No tienes permisos para acceder a esta ronda",
        404: "La ronda solicitada no existe o fue eliminada",
        500: "Error al cargar los datos de la ronda"
      }
    },
    run: {
      acquire: {
        message: "¿Quieres comenzar ahora la ronda de supervisión?",
        messageWithName: "¿Quieres comenzar ahora la ronda de supervisión con nombre: {description}?",
        confirmButton: "Aceptar",
        cancelButton: "Cancelar",
        title: "Confirmación de ronda",
      },
      set: {
        formTitle: "Ronda de Supervisión",
        operationTitle: "Operativa",
        start: "Empezar ronda de supervisión ahora",
        aditionalComments: "Comentarios adicionales",
        proceed: "Proceder",
        send: "Enviar",
        previus: "Anterior",
        next: "Siguiente",
        optionQuestion: {
          actions: "Acciones a realizar:",
          actionsErrorLabel: "Debe completar todas las acciones requeridas",

          comments: {
            placeholder: "Escribe aquí tus comentarios...",
            hide: "Ocultar comentarios",
            add: "Añadir comentarios",
            save: "Guardar",
          }
        }
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
        detailsCard: {
          id: "ID",
          location: "Ubicación",
          start: "Inicio",
          status: "Estado",
          inspections: "Inspecciones",
        },
        videoTitle: "Grabación de la cámara",
        videoDetails: "Detalles de la grabación",
        cameraLabel: "Cámara",
        durationLabel: "Duración",
        dateLabel: "Fecha",
        notAvailable: "No disponible",
        videoNotSupported: "Tu navegador no soporta la reproducción de videos.",
        isAnomalous: "Anómalo",
        downloadTooltip: "Descargar reporte en PDF",
        downloadButton: "Descargar PDF",
      },
      anomalyStatuses: {
        normal: "Normal",
        singleAnomaly: "Anomalía detectada",
        multipleAnomalies: "Múltiples anomalías"
      },
      common: {
        notApplicable: "N/A",
      },
      card: {
        location: "Ubicación",
        round: "Ronda",
        performer: "Realizada por",
        duration: "Duración",
        anomalies: "Anomalías",
        inspectionsWithIssues: "Inspecciones con problemas"
      },
      list: {
        noData: {
          title: "Sin inspecciones disponibles",
          description: "No se han encontrado inspecciones planificadas o ejecutadas."
        }
      },
      errors: {
        get: {
          403: "No tienes permisos para acceder a esta ronda de supervisión",
          404: "La ronda de supervisión solicitada no existe o fue eliminada",
          500: "Error al cargar los datos de la ronda de supervisión"
        },
        list: {
          403: "No tienes permisos para acceder a las rondas de supervisión",
          500: "Error al cargar la lista de rondas de supervisión"
        },
        report: {
          403: "No tienes permisos para acceder al reporte de la ronda de supervisión",
          404: "El reporte de la ronda de supervisión solicitada no existe o fue eliminado",
          500: "Error al cargar el reporte de la ronda de supervisión"
        }
      }
    },
    operators: {
      schedule: {
        errors: {
          403: "No tienes permisos para acceder a las rondas programadas",
          500: "Error al cargar la lista de rondas programadas"
        }
      }
    },
  },
};