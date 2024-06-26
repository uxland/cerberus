import {Paths} from '@cerberus/core/src/utils/auxiliar-types';
import {useLocalePath} from '@uxland/react-services';
import {moduleName} from '../../constants';

export type MaintenanceLocalesPath = Paths<(typeof locales)[typeof moduleName]>;
export const useMaintenanceLocales = (path: MaintenanceLocalesPath) => {
  const globalPath = useLocalePath();
  const locale = locales[moduleName][path];
  return globalPath(locale);
};

export const locales = {
  [moduleName]: {
    title: 'Maintenance App',
  },
};
