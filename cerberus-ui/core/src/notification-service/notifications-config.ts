import {Slide, ToastOptions} from 'react-toastify';

export const NOTIFICATION_OPTIONS: ToastOptions = {
  position: 'bottom-left',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'dark',
  transition: Slide,
};
