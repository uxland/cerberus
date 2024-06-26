import {constantBuilder} from '@uxland/utilities';

export const CERBERUS = 'CERBERUS';
export const contextNameBuilder = constantBuilder(
  CERBERUS.toLowerCase(),
  'context'
);
