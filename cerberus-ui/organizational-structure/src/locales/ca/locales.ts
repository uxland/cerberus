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
    },
    tabs: {
      openIssues: "Incidències",
      pendingReviews: "Anàlisis",
      settings: "Configuració",
      reports: "Reports",
    },
    addLocation: {
      title: "Afegir un nova Localizació",
      description: "Nom Localització",
      locationCode: "Codi de Localització",
      capturePattern: "Pattern",
      placeholder: "Afegir ",
      user: "Usuari",
      password: "Contrasenya",
      submitBtn: "Afegir",
      addBtn: "Afegir Localització",
    },
    addCamera: {
      title: "Afegir un nou Dispositiu",
      name: "Nom Càmera",
      url: "URL",
      user: "Usuari",
      password: "Contrasenya",
      placeholder: "Afegir ",
      submitBtn: "Afegir",
      addBtn: "Afegir Dispositiu",
    },
    addMenu: {
      title: "Afegir Localitzacio o Dispositiu",
    },
  },
};
