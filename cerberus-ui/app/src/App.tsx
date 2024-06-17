import './App.css'
import { dummy } from '@cerberus/core';
import { MaintenanceApp } from '@cerberus/maintenance';
import { OrganizationalStructureApp } from '@cerberus/organizational-structure';
function App() {
  dummy();
  return (
    <>
      <h2>APP</h2>
      <MaintenanceApp />
      <OrganizationalStructureApp />
    </>
  )
}

export default App
