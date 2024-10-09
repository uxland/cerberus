import {
  Fetching,
  getRouteComponent,
  initializeHooks,
  keycloak,
  nop,
} from "@cerberus/core";
import {DrawerMenu} from "@cerberus/organizational-structure/src/ui-components/index.ts";
import {Box, ThemeProvider} from "@mui/material";
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
    return <Fetching />;
  }

  // set navigation esta donant un error en use de hooks
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
