import React, { useState, useEffect } from "react";
import {
  Fetching,
  getRouteComponent,
  initializeHooks,
  keycloak,
  keycloakInitConfig,
  nop,
  refreshToken,
  Toasts,
} from "@cerberus/core";
import {
  UserAuthenticated,
  UserLoggedOut,
} from "@cerberus/core/src/auth/notifications.ts";
import { createUser } from "@cerberus/core/src/auth/utilities.ts";
import { MainMenu } from "@cerberus/organizational-structure/src/ui-components/index.ts";
import { ThemeProvider } from "@mui/material";
import Box from "@mui/material/Box";
import { ReactKeycloakProvider, useKeycloak } from "@react-keycloak/web";
import { Mediator } from "mediatr-ts";
import { connect } from "react-redux";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import Logo from "./assets/logo/instrumenta.png";
import { SetNavigation } from "./navigation/set-navigation.ts";
import theme from "./styles/mui/theme";

initializeHooks();
export const App = ({ routes }) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    new Mediator().send(new SetNavigation(useNavigate)).then(nop);
  }, []);
  const { initialized } = useKeycloak();

  if (!initialized) {
    return <Fetching />;
  }
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: open ? "300px 1fr" : "40px 1fr",
          width: "100%",
          height: "100vh",
          transition: "grid-template-columns 0.3s ease-in-out",
        }}
      >
        <Router>
          <MainMenu logo={Logo} open={open} setOpen={setOpen} />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              margin: "0vw",
              padding: "2rem",
              overflow: "auto",
            }}
          >
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
        <button
          className="absolute top-1/2 -translate-y-1/2 z-50 bg-[#202020] text-white p-2 rounded-r-lg text-2xl"
          onClick={() => setOpen(!open)}
          style={{
            transition: "left 0.3s ease-in-out",
          }}
        >
          &gt;
        </button>
      </Box>
    </ThemeProvider>
  );
};

const mapStateToProps = (state: any) => ({
  routes: state.routes,
});

const eventHandlers = {
  onReady: () => new Mediator().publish(new UserAuthenticated(createUser())),
  onTokenExpired: () => refreshToken(),
  onAuthLogout: new Mediator().publish(new UserLoggedOut()),
  onAuthRefreshError: () => new Mediator().publish(new UserLoggedOut()),
  onAuthRefreshSuccess: () =>
    new Mediator().publish(new UserAuthenticated(createUser())),
};

const eventLogger = (event: string, error: unknown) => {
  console.log("onKeycloakEvent", event, error);
  const handler = eventHandlers[event];
  handler?.();
};

const tokenLogger = (tokens: unknown) => {
  console.log("onKeycloakTokens", tokens);
};
const WrappedApp = ({ routes }) => (
  <ReactKeycloakProvider
    authClient={keycloak}
    initOptions={keycloakInitConfig}
    onEvent={eventLogger}
    onTokens={tokenLogger}
  >
    <App routes={routes} />
  </ReactKeycloakProvider>
);
export default connect(mapStateToProps)(WrappedApp);