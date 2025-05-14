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
import { ThemeProvider, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { ReactKeycloakProvider, useKeycloak } from "@react-keycloak/web";
import { Mediator } from "mediatr-ts";
import { connect } from "react-redux";
import { Tabs, Tab, AppBar, IconButton } from "@mui/material";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import Logo from "./assets/logo/instrumentaNoBg.png";
import { SetNavigation } from "./navigation/set-navigation.ts";
import theme from "./styles/mui/theme";
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

initializeHooks();

const tabsConfig = [
  { label: "Home", path: "" },
  { label: "Operativas", path: "/surveillance/operations" },
  { label: "Inspecciones", path: "/surveillance/runs" },
  { label: "Agenda", path: "/surveillance/scheduler" },
];

const AppContent = ({ routes }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { initialized, keycloak } = useKeycloak();

  // Restore the path after authentication
  useEffect(() => {
    if (initialized && keycloak.authenticated) {
      const redirectPath = sessionStorage.getItem('redirectPath');
      if (redirectPath) {
        navigate(redirectPath);
        sessionStorage.removeItem('redirectPath');
      }
    }
  }, [initialized, keycloak.authenticated, navigate]);

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const currentPath = location.pathname;
    const exactTabIndex = tabsConfig.findIndex(tab => tab.path === currentPath);
    if (exactTabIndex !== -1) {
      setActiveTab(exactTabIndex);
      return;
    }
    const tabIndex = tabsConfig.findIndex(tab =>
      currentPath.startsWith(tab.path) &&
      tabsConfig.every(otherTab =>
        !currentPath.startsWith(otherTab.path) ||
        otherTab.path.length <= tab.path.length ||
        !currentPath.startsWith(tab.path)
      )
    );

    if (tabIndex !== -1) {
      setActiveTab(tabIndex);
    }
  }, [location.pathname]);

  useEffect(() => {
    new Mediator().send(new SetNavigation(navigate)).then(nop);
  }, [navigate]);

  if (!initialized) {
    return <Fetching />;
  }
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    navigate(tabsConfig[newValue].path);
  };
  return (
    <ThemeProvider theme={theme}>
      <Box
        id="app"
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
            height: "100%",
            overflow: "hidden"
          }}
        >
          <AppBar
            position="sticky"
            sx={{
              backgroundColor: "#1f1f1f",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                sx={{
                  "& .MuiTab-root": {
                    color: "#fff",
                    fontWeight: "500",
                    fontSize: "0.9rem",
                    textTransform: "none",
                    minHeight: "48px",
                    transition: "all 0.2s",
                    "&.Mui-selected": {
                      color: "#ffc200",
                    }
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#ffc200",
                    display: "none",
                  }
                }}
              >
                {tabsConfig.map((tab, index) => (
                  <Tab key={index} label={tab.label} />
                ))}
              </Tabs>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography className="!text-gray-200 !mr-2"> Modo: <span className="text-white font-semibold">Keeper </span>  </Typography>
                <IconButton
                  aria-label="profile"
                  onClick={() => { }}
                  sx={{
                    color: '#ffc200',

                  }}
                >
                  <PersonIcon />
                </IconButton>

                <IconButton
                  aria-label="settings"
                  onClick={() => { }}
                  sx={{
                    color: '#ffc200',

                  }}
                >
                  <SettingsIcon />
                </IconButton>
              </Box>
            </Box>
          </AppBar>
          <Box
            sx={{
              padding: "2rem",
              flexGrow: 1,
              overflow: "auto",
              height: "100%",
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
        </Box>
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