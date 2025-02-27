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
          addQuestion: "+ Añadir pregunta",
          type: "Tipología de respuesta",
          subtype: "Subtipología de respuesta",
          isMandatory: "Obligatoriedad",
          normalityRange: "Rango de normalidad",
          option: {
            title: "Respuesta",
            addOption: "+ Añadir opción",
            code: "Código",
            text: "Texto",
            delete: "Eliminar",
          }
        },
      },
      table: {
        id: "ID",
        description: "Descripción",
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
        duration: "Duración aproximada de la ronda",
        proceed: "Proceder",
        asignOperation: "Operativa",
        cronExpressionInput: "Cronología",
        cronExpression: "Ciclo",
      },
      table: {
        id: "ID",
        description: "Descripción",
        assignedTo: "Asignado a",
        cronExpression: "Cronología",
        actions: "Acciones",
      },
    },
  },
};