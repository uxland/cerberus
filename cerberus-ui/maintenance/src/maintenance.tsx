import {useMaintenanceLocales} from './locales/ca/locales';

export const MaintenanceApp = () => {
  return <div>{useMaintenanceLocales('title')}</div>;
};
