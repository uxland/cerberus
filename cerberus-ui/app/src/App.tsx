import {dummy} from '@cerberus/core';
import {MaintenanceApp} from '@cerberus/maintenance';
import {OrganizationalStructureApp} from '@cerberus/organizational-structure';
import {ThemeProvider, Typography} from '@mui/material';
import {useAppLocales} from './locales/ca/locales';
import './styles/App.css';
import theme from './styles/mui/theme';

export const App = () => {
  dummy();
  return (
    <ThemeProvider theme={theme}>
      <Typography variant='h1'>{useAppLocales('title')}</Typography>
      <Typography variant='body1'>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit.
        Exercitationem, quidem. Enim reprehenderit iste deleniti, nobis ea
        quaerat minima officiis! Sint deleniti placeat distinctio aliquam id
        rerum eos commodi. Neque, sapiente?
      </Typography>
      <MaintenanceApp />
      <OrganizationalStructureApp />
    </ThemeProvider>
  );
};

export default App;
