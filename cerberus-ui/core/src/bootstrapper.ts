import {ApiClient} from '@cerberus/shared/src';
import {NotificationService} from '@uxland/react-services';
import {Container, injectable} from 'inversify';
import {ApiClientImpl} from './api/api-client.ts';
import {container} from './ioc';
import {notificationService} from './notification-service/notification-service.ts';
import {NavigationService} from './routing';
import {navigationService} from './routing/navigation-service.ts';
export const bootstrapCore = async () => {
  console.log('core bootstrapping');
  injectable()(ApiClient);
  injectable()(ApiClientImpl);
  container.bind<ApiClient>(ApiClient).to(ApiClientImpl).inSingletonScope();
  container.bind<Container>(Container).toConstantValue(container);
  container
    .bind<NavigationService>(NavigationService)
    .toConstantValue(navigationService);
  container
    .bind<NotificationService>(NotificationService)
    .toConstantValue(notificationService);
  return container;
};

export const teardownCore = () => {
  console.log('core teardown');
  container.isBound(ApiClient) && container.unbind(ApiClient);
};
