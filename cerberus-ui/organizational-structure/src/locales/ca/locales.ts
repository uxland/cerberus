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
      openIssues: "Open issues",
      pendingReviews: "Analysis",
      settings: "Settings",
      reports: "Reports",
    },
    addLocation: {
      title: "Afegir un nova localizació",
      description: "Nom localització",
      locationCode: "Codi de localització",
      capturePattern: "Pattern",
      placeholder: "Afegir ",
      user: "Usuari",
      password: "Contrasenya",
      submitBtn: "Afegir",
      addBtn: "Afegir Localització",
    },
    addCamera: {
      title: "Afegir un nou dispositiu",
      name: "Nom camera",
      url: "URL",
      user: "Usuari",
      password: "Contrasenya",
      placeholder: "Afegir ",
      submitBtn: "Afegir",
      addBtn: "Afegir dispositiu",
    },
  },
};
