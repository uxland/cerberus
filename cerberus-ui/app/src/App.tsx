import {dummy} from '@cerberus/core';
import {MaintenanceApp} from '@cerberus/maintenance';
import {OrganizationalStructureApp} from '@cerberus/organizational-structure';
import {Typography} from '@mui/material';
import './styles/App.css';
function App() {
  dummy();
  return (
    <>
      <Typography variant='h1'>APP</Typography>
      <h2>APP</h2>
      <MaintenanceApp />
      <OrganizationalStructureApp />
    </>
  );
}

export default App;
