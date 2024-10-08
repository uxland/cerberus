import {store} from "@cerberus/core";
import {ModalProvider} from "@cerberus/core/src/providers/ModalProvider.tsx";
import {createRoot} from "react-dom/client";
import {Provider} from "react-redux";
import {ModalContainer} from "./presentation/components/ModalContainer.tsx";
import "./setup.ts";
import "./styles/index.css";

const initApp = async () => {
  const App = (await import("./App.tsx")).default;
  createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
      <ModalProvider>
        <ModalContainer />
        <App />
      </ModalProvider>
    </Provider>
  );
};
/*
bootstrapApplication()
.then(initApp)*/
const init = async () => {
  const bootstrapper = await import("./bootstrapper.ts");
  await bootstrapper.bootstrapApplication();
};
init().then(initApp);
