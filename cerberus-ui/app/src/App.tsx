import {
  getRouteComponent,
  initializeHooks,
  keycloak,
  nop,
} from "@cerberus/core";
import {DrawerMenu} from "@cerberus/organizational-structure/src/ui-components/index.ts";
import {Box, CircularProgress, ThemeProvider, Typography} from "@mui/material";
import {ReactKeycloakProvider, useKeycloak} from "@react-keycloak/web";
import {Mediator} from "mediatr-ts";
import {useEffect} from "react";
import {connect} from "react-redux";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import Logo from "./assets/logo/instrumenta.png";
import {SetNavigation} from "./navigation/set-navigation.ts";
import theme from "./styles/mui/theme";

initializeHooks();
export const App = ({routes}) => {
  const {initialized} = useKeycloak();

  if (!initialized) {
    return (
      <div
        className={`flex felx-col w-full h-full items-center justify-center  }`}>
        <div className="flex flex-col items-center justify-center">
          <Typography variant="h5">Carregant dades...</Typography>
          <CircularProgress style={{color: "#ffc200"}} size={52} />
        </div>
      </div>
    );
  }

  useEffect(() => {
    new Mediator().send(new SetNavigation(useNavigate)).then(nop);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{display: "flex", width: "100%"}}>
        <Router>
          <DrawerMenu logo={Logo} />
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
