import {getRouteComponent, keycloak, nop, Toasts} from "@cerberus/core";
import {OrganizationalStructureTreeNode} from "@cerberus/organizational-structure";
import {Box, ThemeProvider, Typography} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import {ReactKeycloakProvider, useKeycloak} from "@react-keycloak/web";
import {Mediator} from "mediatr-ts";
import {useEffect} from "react";
import {connect} from "react-redux";
import {
  Link,
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import Logo from "./assets/logo/instrumenta.png";
import {SetNavigation} from "./navigation/set-navigation.ts";
import theme from "./styles/mui/theme";
export const App = ({routes}) => {
  const {initialized} = useKeycloak();
  if (!initialized) {
    return <div>Loading...</div>;
  }

  // set navigation esta donant un error en use de hooks
  useEffect(() => {
    new Mediator().send(new SetNavigation(useNavigate)).then(nop);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{display: "flex", width: "100%"}}>
        <Router>
          <Drawer
            PaperProps={{sx: {width: "20vw"}}}
            anchor="left"
            variant="permanent">
            <Box color={"CaptionText"} gap={4}>
              <div className="flex flex-col">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-center h-20 max-h-24">
                    <Link to={"/"}>
                      {<img className="h-14" src={Logo} alt={Logo} />}
                    </Link>
                  </div>
                  <div className="flex p-6 bg-[#202020] justify-between">
                    <div className="flex flex-col items-start p-1">
                      <Typography variant="h3">115</Typography>
                      <Typography variant="body1">Alertas Activas</Typography>
                    </div>
                  </div>
                </div>
                <div className="h-full">
                  {<OrganizationalStructureTreeNode />}
                </div>
              </div>
            </Box>
          </Drawer>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              marginLeft: "20vw",
              padding: "2rem",
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
        </Router>
      </Box>
    </ThemeProvider>
  );
};

const mapStateToProps = (state: any) => ({
  routes: state.routes,
});

const eventLogger = (event: unknown, error: unknown) => {
  console.log("onKeycloakEvent", event, error);
};
const keycloakInitConfig = {
  onLoad: "login-required",
  redirectUri: "https://cerberus-react-ui:5173",
  checkLoginIframe: false,
};
const tokenLogger = (tokens: unknown) => {
  console.log("onKeycloakTokens", tokens);
};
const WrappedApp = ({routes}) => (
  <ReactKeycloakProvider
    authClient={keycloak}
    initOptions={keycloakInitConfig}
    onEvent={eventLogger}
    onTokens={tokenLogger}>
    <App routes={routes} />
  </ReactKeycloakProvider>
);
export default connect(mapStateToProps)(WrappedApp);
