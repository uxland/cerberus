import './setup.ts';
import React from 'react';
import {createRoot} from 'react-dom/client';
import './styles/index.css';

const initApp = async () =>{
    const App = (await import('./App.tsx')).default;
    createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
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