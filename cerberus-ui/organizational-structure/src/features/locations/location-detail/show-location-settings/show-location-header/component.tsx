import {Button, Typography} from '@mui/material';
import {Mediator} from 'mediatr-ts';
import {CaptureSnapshots} from '../../../../capture-snapshot/command';
import {LocationSettings} from '../model';

export const HeaderComponent = (settings: LocationSettings) => {
  const capture = () => new Mediator().send(new CaptureSnapshots(settings.id));

  return (
    <div className='flex justify-between'>
      <Typography variant='h2' color='#fff'>
        {settings.path} ({settings.description})
      </Typography>
      <Button
        variant='outlined'
        className='capture-btn'
        aria-label='Capture'
        onClick={capture}>
        Capture Me
      </Button>
    </div>
  );
};
