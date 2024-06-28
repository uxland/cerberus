import {OrganizationalStructureTreeNode} from '@cerberus/organizational-structure';
import {Box, ThemeProvider, Typography} from '@mui/material';
import {useAppLocales} from './locales/ca/locales';
import './styles/App.css';
import theme from './styles/mui/theme';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {connect} from "react-redux";
import {getRouteComponent} from "@cerberus/core";
import Logo from "./assets/instrumenta.png";
import Drawer from "@mui/material/Drawer";

export const App = ({routes}) => {
    return (
        <ThemeProvider theme={theme}>
            <Typography variant='h1'>{useAppLocales('title')}</Typography>
            <Router>
                <Drawer
                    PaperProps={{sx: {width: '20vw'}}}
                    anchor='left'
                    variant='permanent'>
                    <Box color={'CaptionText'} gap={4}>
                        <div className='flex flex-col gap-2'>
                            <div className='h-22 p-4'>
                                <img src={Logo} />
                            </div>
                            <div className='flex p-6 bg-[#202020] justify-between'>
                                <div className='flex flex-col items-start p-1'>
                                    <Typography variant='h3'>115</Typography>
                                    <Typography variant='body1'>Alertas Activas</Typography>
                                </div>
                            </div>
                        </div>
                        <div className='h-full '>
                            <OrganizationalStructureTreeNode/>
                        </div>
                    </Box>
                </Drawer>
                <Routes>
                    {routes.map((route: any) => {
                        const Component = getRouteComponent(route.componentName);
                        return (
                            <Route key={route.name} path={route.path} Component={Component} />
                        );
                    })}
                </Routes>

            </Router>


        </ThemeProvider>
    );
};

const mapStateToProps = (state: any) => ({
    routes: state.routes
});

export default connect(mapStateToProps)(App);
