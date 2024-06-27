import {DrawerContainer} from '@cerberus/core';
import {DrawerProvider} from '@cerberus/core/src/providers/DrawerProvider';
import {OrganizationalStructureTreeNode} from '@cerberus/organizational-structure';
import {ThemeProvider, Typography} from '@mui/material';
import {useAppLocales} from './locales/ca/locales';
import './styles/App.css';
import theme from './styles/mui/theme';

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Typography variant='h1'>{useAppLocales('title')}</Typography>
      <DrawerProvider>
        <DrawerContainer />
      </DrawerProvider>
      <OrganizationalStructureTreeNode />
    </ThemeProvider>
  );
};

export default App;
