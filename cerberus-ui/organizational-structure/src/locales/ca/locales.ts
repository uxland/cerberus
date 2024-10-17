import {getNestedValue} from "@cerberus/core";
import {Paths} from "@cerberus/core/src/utils/auxiliar-types";
import {useLocalePath} from "@uxland/react-services";
import {moduleName} from "../../constants";

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
      captures: "Captures",
      camera: "Càmera",
      location: "Localització",
    },
    upload: {
      title: "Adjunta arxiu",
      file: "Pujar arxiu",
    },
    tabs: {
      openIssues: "Incidències",
      pendingReviews: "Anàlisis",
      settings: "Configuració",
      reports: "Reports",
      maintenancesSettings: "Configuració Manteniment",
    },
    addLocation: {
      title: "Afegir un nova Localizació",
      description: "Nom Localització",
      locationCode: "Codi de Localització",
      capturePattern: "Patró de Captura",
      placeholder: "Afegir ",
      user: "Usuari",
      password: "Contrasenya",
      submitBtn: "Afegir",
      addBtn: "Afegir Localització",
      notifcation: {
        success: "Localització afegida correctament",
        error: "Error al afegir Localització",
      },
    },
    addCamera: {
      title: "Afegir una nova Càmera",
      name: "Nom Càmera",
      capturePattern: "Patró de Captura",
      url: "URL",
      user: "Usuari",
      password: "Contrasenya",
      placeholder: "Afegir ",
      submitBtn: "Afegir",
      addBtn: "Afegir Càmera",
      notifcation: {
        success: "Càmera afegida correctament",
        error: "Error al afegir Càmera",
      },
    },
    addMenu: {
      title: "Afegir Localitzacio o Càmera",
    },
  },
};
