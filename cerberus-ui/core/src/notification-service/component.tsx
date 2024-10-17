import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Toasts = (props: {text?: string}) => {
  return <ToastContainer limit={15} />;
};
