import {DrawerContainer} from '@cerberus/core';
import {DrawerProvider} from '@cerberus/core/src/providers/DrawerProvider';
import {OrganizationalStructureTreeNode} from '@cerberus/organizational-structure';
import {ThemeProvider, Typography} from '@mui/material';
import {useAppLocales} from './locales/ca/locales';
import './styles/App.css';
import theme from './styles/mui/theme';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {connect} from "react-redux";
import {getRouteComponent} from "@cerberus/core";

export const App = ({routes}) => {
  return (
    <ThemeProvider theme={theme}>
      <Typography variant='h1'>{useAppLocales('title')}</Typography>
      <DrawerProvider>
        <DrawerContainer />
      </DrawerProvider>
      <OrganizationalStructureTreeNode />
    <Router>
        <Routes>
            {
                routes.map((route: any, index: number) =>{
                    const Component = getRouteComponent(route.componentName);
                    return(
                        <Route key={index} path={route.path} Component={Component} />
                    )
                })
            }
        </Routes>
    </Router>
    </ThemeProvider>
  );
};

const mapStateToProps = (state: any) => ({
    routes: state.routes
});

export default connect(mapStateToProps)(App);
