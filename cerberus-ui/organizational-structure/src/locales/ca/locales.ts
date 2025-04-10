import { getNestedValue } from "@cerberus/core";
import { Paths } from "@cerberus/core/src/utils/auxiliar-types";
import { useLocalePath } from "@uxland/react-services";
import { moduleName } from "../../constants";

export type OrganizationalStructureLocalesPath = Paths<
  (typeof locales)[typeof moduleName]
>;
export const useOrganizationalStructureLocales = (
  path: OrganizationalStructureLocalesPath
) => {
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
    views: {
      captures: "Capturas",
      camera: "Cámara",
      location: "Localización",
    },
    upload: {
      title: "Adjuntar archivo",
      file: "Subir archivo",
      placeholder: "Subir archivo en formato .xlsx,.xls",
    },
    edit: "Editar",
    delete: "Eliminar",
    tabs: {
      openIssues: "Incidencias",
      pendingReviews: "Rendimiento",
      settings: "Configuración",
      reports: "Informes",
      maintenancesSettings: "Configuración Mantenimiento",
      captures: "Capturas",
      operations: "Operativas",
      rounds: "Rondas de supervisión",
      inspections: "Inspecciones",
    },
    addLocation: {
      title: "Añadir una nueva Localización",
      description: "Nombre Localización",
      locationCode: "Código de Localización",
      capturePattern: "Patrón de Captura",
      placeholder: "Añadir ",
      user: "Usuario",
      password: "Contraseña",
      submitBtn: "Añadir",
      addBtn: "Añadir Localización",
      notifcation: {
        success: "Localización añadida correctamente",
        error: "Error al añadir Localización",
      },
    },
    addCamera: {
      title: "Añadir una nueva Cámara",
      name: "Nombre Cámara",
      capturePattern: "Patrón de Captura",
      cameraCode: "Código de Cámara",
      url: "URL",
      brandName: "Marca",
      modelName: "Modelo",
      price: "Precio",
      manufactureYear: "Año de Fabricación",
      user: "Usuario",
      password: "Contraseña",
      placeholder: "Añadir ",
      submitBtn: "Añadir",
      addBtn: "Añadir Cámara",
      notifcation: {
        success: "Cámara añadida correctamente",
        error: "Error al añadir Cámara",
      },
    },
    removeCamera: {
      removeBtn: "Eliminar Cámara",
      notifcation: {
        success: "Cámara eliminada correctamente",
        error: "Error al eliminar Cámara",
      },
    },
    editCamera: {
      notifcation: {
        success: "Cámara modificada correctamente",
        error: "Error al modificar Cámara",
      },
    },
    addMenu: {
      title: "Añadir Localización o Cámara",
    },
    cameraSettings: {
      id: "Id",
      description: "Descripción",
    },
    mainMenu: {
      activeAlerts: "Alertas activas",
      newAlerts: "Nuevas alertas",
      search: "Buscar dispositivo, grupo...",
      addRootNode: "Añadir Nodo Raíz",
    },
  },
};