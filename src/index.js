import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import {SocketContext,socket} from './Context/SocketContext'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <SocketContext.Provider value={socket}>
    <App />
    </SocketContext.Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);


