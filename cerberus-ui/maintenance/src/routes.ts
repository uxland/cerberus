import {Route} from '@cerberus/core/domain';
import {MAINTENANCE_ROUTE} from './constants';
import {MaintenanceApp} from './maintenance';

export const routes: Route[] = [
  {path: MAINTENANCE_ROUTE, element: MaintenanceApp},
];
