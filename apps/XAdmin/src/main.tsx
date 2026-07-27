import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css';
import NotificationTray from './components/NotificationTray';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// mount notification tray into the DOM so it sits above layout content
const container = document.createElement('div');
container.id = 'global-notifications';
document.body.appendChild(container);
import { createRoot } from 'react-dom/client';
createRoot(container).render(<NotificationTray />);
