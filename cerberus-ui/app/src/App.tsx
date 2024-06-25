import {dummy} from '@cerberus/core';
import {MaintenanceApp} from '@cerberus/maintenance';
import {OrganizationalStructureApp} from '@cerberus/organizational-structure';
import {ThemeProvider, Typography} from '@mui/material';
import './styles/App.css';
import theme from './styles/mui/theme';
function App() {
  dummy();
  return (
    <ThemeProvider theme={theme}>
      <Typography variant='h1'>CERBERUS UI</Typography>
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
}

export default App;
