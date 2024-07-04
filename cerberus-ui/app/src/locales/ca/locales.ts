import {Paths} from '@cerberus/core/src/utils/auxiliar-types';
import {useGlobalPath} from '@uxland/react-services';
import {moduleName} from '../../constants';

export type AppLocalesPath = Paths<(typeof locales)[typeof moduleName]>;
export const useAppLocales = (path: AppLocalesPath) => {
  const globalPath = useGlobalPath();
  return globalPath(`${moduleName}.${path}`);
};

export const locales = {
  [moduleName]: {
    title: 'BENVINGUT CERBERUS',
  },
};
