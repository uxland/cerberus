import {provideSingleton} from '@uxland/ioc';
import {NotificationService} from '@uxland/react-services';
import {injectable} from 'inversify';
import {ToastOptions} from 'react-toastify';
import {NOTIFICATION_OPTIONS} from './notifications-config';

@injectable()
@provideSingleton(NotificationService)
export class NotificationServiceImplementation
  extends NotificationService
  implements NotificationService
{
  notify(message: string, options?: ToastOptions<any>): void {
    super.notify(message, options || NOTIFICATION_OPTIONS);
  }

  notifyInfo(message: string, options?: ToastOptions<any>): void {
    super.notifyInfo(message, options || NOTIFICATION_OPTIONS);
  }

  notifySuccess(message: string, options?: ToastOptions<any>): void {
    super.notifySuccess(message, options || NOTIFICATION_OPTIONS);
  }

  notifyWarning(message: string, options?: ToastOptions<any>): void {
    super.notifyWarning(message, options || NOTIFICATION_OPTIONS);
  }

  notifyError(message: string, options?: ToastOptions<any>): void {
    super.notifyError(message, options || NOTIFICATION_OPTIONS);
  }
}

export const notificationService: NotificationService =
  new NotificationServiceImplementation();
