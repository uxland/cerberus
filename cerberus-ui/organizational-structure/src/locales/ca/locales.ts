import {Paths} from '@cerberus/core/src/utils/auxiliar-types';
import {useLocalePath} from '@uxland/react-services';
import {moduleName} from '../../constants';

export type OrganizationalStructureLocalesPath = Paths<
  (typeof locales)[typeof moduleName]
>;
export const useOrganizationalStructureLocales = (
  path: OrganizationalStructureLocalesPath
) => {
  const globalPath = useLocalePath();
  const locale = locales[moduleName][path];
  return globalPath(locale);
};

export const locales = {
  [moduleName]: {
    title: 'Organizational-structure App',
  },
};
