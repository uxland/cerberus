import {getRouteComponent, nop, Toasts} from '@cerberus/core';
import {OrganizationalStructureTreeNode} from '@cerberus/organizational-structure';
import {Box, ThemeProvider, Typography} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import {Mediator} from 'mediatr-ts';
import {useEffect} from 'react';
import {connect} from 'react-redux';
import {
  Link,
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from 'react-router-dom';
// import 'react-toastify/dist/ReactToastify.css';
import Logo from './assets/logo/instrumenta.png';
import {SetNavigation} from './navigation/set-navigation.ts';
import theme from './styles/mui/theme';

export const App = ({routes}) => {
  useEffect(() => {
    new Mediator().send(new SetNavigation(useNavigate)).then(nop);
  }, []);
  return (
    <Router>
      <Box sx={{display: 'flex', width: '100%'}}>
        <ThemeProvider theme={theme}>
          <Drawer
            PaperProps={{sx: {width: '20vw'}}}
            anchor='left'
            variant='permanent'>
            <Box color={'CaptionText'} gap={4}>
              <div className='flex flex-col'>
                <div className='flex flex-col gap-1'>
                  <div className='flex items-center justify-center h-20 max-h-24'>
                    <Link to={'/'}>
                      {<img className='h-14' src={Logo} alt={Logo} />}
                    </Link>
                  </div>
                  <div className='flex p-6 bg-[#202020] justify-between'>
                    <div className='flex flex-col items-start p-1'>
                      <Typography variant='h3'>115</Typography>
                      <Typography variant='body1'>Alertas Activas</Typography>
                    </div>
                  </div>
                </div>
                <div className='h-full'>
                  {<OrganizationalStructureTreeNode />}
                </div>
              </div>
            </Box>
          </Drawer>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              marginLeft: '20vw',
              padding: '2rem',
            }}>
            <Routes>
              {routes.map((route: any) => {
                const Component = getRouteComponent(route.componentName);
                return (
                  <Route
                    key={route.name}
                    path={route.path}
                    Component={Component}
                  />
                );
              })}
            </Routes>
          </Box>
          <Toasts />
        </ThemeProvider>
      </Box>
    </Router>
  );
};

const mapStateToProps = (state: any) => ({
  routes: state.routes,
});

export default connect(mapStateToProps)(App);
