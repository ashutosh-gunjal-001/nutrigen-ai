import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import AppRoutes from './routes/AppRoutes';
import './styles/global.css';
import { loadUser } from './app/features/authSlice';
import { ThemeProvider } from './context/ThemeContext';


if (localStorage.getItem('token')) {
  store.dispatch(loadUser());
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;