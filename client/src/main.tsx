import React from 'react'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'
import { store, persistor } from './redux/store.js'
import { PersistGate } from 'redux-persist/integration/react';
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root') as HTMLElement).render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
        <App />
    </Provider>
  </PersistGate>
)
