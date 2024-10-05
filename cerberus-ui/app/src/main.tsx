import './setup.ts';
import React from 'react';
import {createRoot} from 'react-dom/client';
import './styles/index.css';
import {Provider} from "react-redux";
import {AuthClient, store, TYPES} from "@cerberus/core";
import {Container} from "inversify";

const initApp = async (container: Container) =>{
    const App = (await import('./App.tsx')).default;
    const rootElement = document.getElementById('root');
    try {
        const authenticated = await initAuth(container);
        if(authenticated){
            const root =createRoot(rootElement);
            root.render(
                <React.StrictMode>
                    <Provider store={store}>
                        <App />
                    </Provider>
                </React.StrictMode>
            );
        }
        else{
            console.warn('Not authenticated ');
        }
    }
    catch (e){
        console.error('Authentication failed:', e);
    }

}

const initAuth = async (container: Container) =>{
    const authClient = container.get<AuthClient>(TYPES.authClient);
    return authClient.init();
}
/*
bootstrapApplication()
.then(initApp)*/
const init = async() =>{
    const bootstrapper = await import('./bootstrapper.ts');
    return await bootstrapper.bootstrapApplication();
}
init().then(initApp).then(()=>console.log('App initialized')).catch(e=>console.error('Error initializing app:', e));