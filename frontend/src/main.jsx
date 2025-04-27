import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
//import reportWebVitals from './reportWebVitals.jsx'
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { StrictMode } from 'react';
import { Provider } from 'react-redux'
import { store } from './store/store.jsx'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 // <React.StrictMode>
    <Provider store={store}>
     <RouterProvider router={router}/>
    </Provider>
 // </React.StrictMode>
);
