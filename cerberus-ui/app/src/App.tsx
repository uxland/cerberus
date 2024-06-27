import {MaintenanceApp} from '@cerberus/maintenance';
import {OrganizationalStructureTreeNode} from '@cerberus/organizational-structure';
import {ThemeProvider, Typography} from '@mui/material';
import {useAppLocales} from './locales/ca/locales';
import './styles/App.css';
import theme from './styles/mui/theme';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {connect} from "react-redux";
import {
    OrganizationalStructureFileUploader
} from "@cerberus/organizational-structure/src/features/upload-organization-structure-file/component.tsx";
import {getRouteComponent} from "@cerberus/core";

export const App = ({routes}) => {
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
      <OrganizationalStructureTreeNode />
    <Router>
        <Routes>
            {
                routes.map((route: any, index: number) =>{
                    const Component = getRouteComponent(route.componentName);
                    return(
                        <Route key={index} path={route.path} exact={route.exact} Component={Component} />
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
