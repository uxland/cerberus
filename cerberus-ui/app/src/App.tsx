import {DrawerContainer, getRouteComponent} from '@cerberus/core';
import {DrawerProvider} from '@cerberus/core/src/providers/DrawerProvider';
import {ThemeProvider, Typography} from '@mui/material';
import {connect} from 'react-redux';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import {useAppLocales} from './locales/ca/locales';
import './styles/App.css';
import theme from './styles/mui/theme';

export const App = ({routes}) => {
  return (
    <ThemeProvider theme={theme}>
      <Typography variant='h1'>{useAppLocales('title')}</Typography>
      <DrawerProvider>
        <DrawerContainer />
        {/* <OrganizationalStructureTreeNode /> */}
        <Router>
          <Routes>
            {routes.map((route: any, index: number) => {
              const Component = getRouteComponent(route.componentName);
              return (
                <Route key={index} path={route.path} Component={Component} />
              );
            })}
          </Routes>
        </Router>
      </DrawerProvider>
    </ThemeProvider>
  );
};

const mapStateToProps = (state: any) => ({
  routes: state.routes,
});

export default connect(mapStateToProps)(App);
