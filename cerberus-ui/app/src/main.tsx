import './setup.ts';
import {createRoot} from 'react-dom/client';
import './styles/index.css';
import {Provider} from "react-redux";
import {store} from "@cerberus/core";

const initApp = async () =>{
    const App = (await import('./App.tsx')).default;
    createRoot(document.getElementById('root')!).render(
        <Provider store={store}>
            <App />
        </Provider>
    );
}
/*
bootstrapApplication()
.then(initApp)*/
const init = async() =>{
    const bootstrapper = await import('./bootstrapper.ts');
    await bootstrapper.bootstrapApplication();
}
init().then(initApp);