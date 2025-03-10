import './index.css';
import App from './App.jsx';
import CssBaseline from '@mui/material/CssBaseline';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')).render(
  <>
    <CssBaseline />
    <App />
  </>
);
