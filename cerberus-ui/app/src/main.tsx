import {setupI18N} from '@uxland/react-services';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import {locales as CA} from './locales/ca/locales.ts';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
setupI18N({ca: CA}, 'ca');
