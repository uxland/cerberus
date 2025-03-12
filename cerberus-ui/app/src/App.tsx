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
import Logo from "./assets/logo/instrumentaNoBg.png";
import { SetNavigation } from "./navigation/set-navigation.ts";
import theme from "./styles/mui/theme";
import { UserInteractionProvider } from "@cerberus/core";

initializeHooks();

const AppContent = ({ routes }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    new Mediator().send(new SetNavigation(navigate)).then(nop);
  }, [navigate]);

  const { initialized } = useKeycloak();

  if (!initialized) {
    return <Fetching />;
  }

  return (
    <ThemeProvider theme={theme}>
      <UserInteractionProvider>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: open ? "300px 1fr" : "40px 1fr",
            width: "100%",
            height: "100vh",
            transition: "grid-template-columns 0.3s ease-in-out",
          }}
        >
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
                console.log("Route:", route);
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
          <button
            className="absolute top-1/2 -translate-y-1/2 z-50 bg-[#353535] text-white p-2.5 hover:bg-[#636363] transition-colors rounded-r-xl text-2xl"
            onClick={() => setOpen(!open)}
            style={{
              transition: "left 0.3s ease-in-out",
            }}
          >
            <svg
              className="w-5 h-5 fill-current rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M14.95121,1.99995L4.95118,11.99842l10.00002,10.00158,3.00344-3.00344-6.72184-6.99814,1.85764-2.12302,4.87201-4.87201-3.01125-3.00344Z" />
            </svg>
          </button>
        </Box>
      </UserInteractionProvider>

    </ThemeProvider>
  );
};

export const App = ({ routes }) => (
  <Router>
    <AppContent routes={routes} />
  </Router>
);

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