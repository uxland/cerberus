import {useOrganizationalStructureLocales} from './locales/ca/locales';

export const OrganizationalStructureApp = () => {
  return <div>{useOrganizationalStructureLocales('title')}</div>;
};
