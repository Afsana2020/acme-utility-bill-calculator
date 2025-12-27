import React, { useState, useEffect } from 'react';
import { UserCalculator } from './components/UserCalculator';
import { AdminPanel } from './components/AdminPanel';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';

function App() {
  const [adminView, setAdminView] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  useEffect(() => {
    const savedAuth = localStorage.getItem('adminLoggedIn');
    if (savedAuth === 'true') {
      setAdminLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (adminLoggedIn) {
      localStorage.setItem('adminLoggedIn', 'true');
    } else {
      localStorage.removeItem('adminLoggedIn');
    }
  }, [adminLoggedIn]);

  const handleLogout = () => {
    setAdminLoggedIn(false);
    setAdminView(false);
  };

  const handleLogin = () => {
    setAdminLoggedIn(true);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: '#fff',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* navbar */}
      <AppBar position="static" sx={{ bgcolor: '#1e88e5' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 500 }}>
            A.H. Electricity
          </Typography>
         
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {adminLoggedIn && (
              <Button
                variant="contained"
                onClick={handleLogout}
                sx={{
                  bgcolor: '#d32f2f',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#b71c1c'
                  },
                  fontWeight: 600,
                  textTransform: 'none',
                  mr: 1
                }}
              >
                Logout
              </Button>
            )}
           
            <Button
              variant={adminView ? "outlined" : "contained"}
              onClick={() => setAdminView(false)}
              sx={{
                bgcolor: adminView ? 'transparent' : 'white',
                color: adminView ? 'white' : '#1e88e5',
                borderColor: 'white',
                '&:hover': {
                  bgcolor: adminView ? 'rgba(255,255,255,0.1)' : '#f5f5f5'
                },
                fontWeight: 600,
                textTransform: 'none'
              }}
            >
              Bill Calculate
            </Button>
           
            <Button
              variant={adminView ? "contained" : "outlined"}
              onClick={() => setAdminView(true)}
              sx={{
                bgcolor: adminView ? 'white' : 'transparent',
                color: adminView ? '#1e88e5' : 'white',
                borderColor: 'white',
                '&:hover': {
                  bgcolor: adminView ? '#f5f5f5' : 'rgba(255,255,255,0.1)'
                },
                fontWeight: 600,
                textTransform: 'none'
              }}
            >
              {adminLoggedIn ? 'Admin Panel' : 'Admin Login'}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Small loading note */}
      <Box sx={{
        bgcolor: '#e3f2fd',
        color: '#1565c0',
        textAlign: 'center',
        py: 1,
        fontSize: '0.875rem'
      }}>
        <Typography variant="body2">
    Note: First load may take a bit longer as the app is deployed using Render's free tier. Thank you for your patience!
        </Typography>
      </Box>

      <Box sx={{ flex: 1, p: 4 }}>
        {adminView ? (
          <AdminPanel
            onLogin={handleLogin}
            isLoggedIn={adminLoggedIn}
          />
        ) : (
          <UserCalculator />
        )}
      </Box>

      {/* footer */}
      <Box sx={{
        bgcolor: '#1e88e5',
        color: 'white',
        textAlign: 'center',
        py: 2
      }}>
        <Typography variant="body2">
          © 2025 AH. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

export default App;
