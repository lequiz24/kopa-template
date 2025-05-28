import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import KYCPage from './pages/KYCPage';
import LoanApplication from './pages/LoanApplication';
import ProtectedRoute from './components/ProtectedRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Darker green for trust
      light: '#4CAF50', // Accent green
    },
    secondary: {
      main: '#FFA000', // Amber for CTAs
    },
    background: {
      default: '#f9f9f9',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 20px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/kyc" element={<ProtectedRoute><KYCPage /></ProtectedRoute>} />
          <Route path="/apply-loan" element={<ProtectedRoute><LoanApplication /></ProtectedRoute>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;