import CancelIcon from '@mui/icons-material/Cancel';
import {IconButton} from '@mui/material';
import {useNavigate} from 'react-router-dom';

export const HeaderBar = (props: {component: JSX.Element; close?: boolean}) => {
  const navigate = useNavigate();
  return (
    <div className='flex items-center p-4 rounded-[10px] gap-4 h-16 w-full !bg-tableBg justify-between'>
      {props.component}
      {props.close && (
        <IconButton onClick={() => navigate(-1)}>
          <div className='flex gap-2'>
            <CancelIcon className='!fill-error' />
          </div>
        </IconButton>
      )}
    </div>
  );
};
