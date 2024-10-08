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
      name: "Nom localizació",
      pattern: "Pattern",
      user: "Usuari",
      placeholder: "Afegir ",
      password: "Contrasenya",
      submit: "Afegir",
    },
  },
};
