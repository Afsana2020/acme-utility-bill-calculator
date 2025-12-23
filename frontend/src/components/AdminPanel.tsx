import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TextField, Button, Typography, Paper, Box, Alert 
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface AdminPanelProps {
  onLogin: () => void;
  isLoggedIn: boolean;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogin, isLoggedIn }) => {
  const [config, setConfig] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [editRate, setEditRate] = useState(false);
  const [editVat, setEditVat] = useState(false);
  const [editService, setEditService] = useState(false);
  const [newRate, setNewRate] = useState('');
  const [newVat, setNewVat] = useState('');
  const [newService, setNewService] = useState('');
  const [saving, setSaving] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      getSettings();
    }
  }, [isLoggedIn]);

  const getSettings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/config`);
      setConfig(res.data);
    } catch (err) {
      console.error('Cant get settings', err);
    }
    setLoading(false);
  };

  // to handle admin login
  const login = () => {
    if (pin === process.env.REACT_APP_ADMIN_PIN) {
      onLogin();
      setError(null);
    } else {
      setError('Wrong pin');
    }
  };

    // update rate per unit
  const saveRate = async () => {
    if (!newRate || isNaN(Number(newRate))) return;
    
    setSaving('rate');
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/config/update`,
        { rate_per_unit: Number(newRate) },
        { headers: { 'x-admin-pin': process.env.REACT_APP_ADMIN_PIN } }
      );
      setOk(true);
      getSettings();
      setEditRate(false);
      setNewRate('');
      setTimeout(() => setOk(false), 2000);
    } catch (err) {
      setError('Failed');
    }
    setSaving('');
  };

  //to update vat percentage
  const saveVat = async () => {
    if (!newVat || isNaN(Number(newVat))) return;
    
    setSaving('vat');
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/config/update`,
        { vat_percentage: Number(newVat) },
        { headers: { 'x-admin-pin': process.env.REACT_APP_ADMIN_PIN } }
      );
      setOk(true);
      getSettings();
      setEditVat(false);
      setNewVat('');
      setTimeout(() => setOk(false), 2000);
    } catch (err) {
      setError('Failed');
    }
    setSaving('');
  };

  //to update fixed service charge
  const saveService = async () => {
    if (!newService || isNaN(Number(newService))) return;
    
    setSaving('service');
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/config/update`,
        { fixed_service_charge: Number(newService) },
        { headers: { 'x-admin-pin': process.env.REACT_APP_ADMIN_PIN } }
      );
      setOk(true);
      getSettings();
      setEditService(false);
      setNewService('');
      setTimeout(() => setOk(false), 2000);
    } catch (err) {
      setError('Failed');
    }
    setSaving('');
  };

  const showNum = (value: any) => {
    const num = parseFloat(value);
    return isNaN(num) ? '...' : num.toFixed(2);
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', p: 1 }}>
      <Typography variant="h5" gutterBottom align="center" color="primary">
        Admin LOGIN
      </Typography>
{/* configuration from database and update options*/}
      {!isLoggedIn ? (
        <Paper sx={{ p: 4, border: '1px solid #ddd' }}>
          <Typography
            variant="body2"
            gutterBottom
            sx={{ py: 1, px: 0 }}
          >
            Only Admin can update configuration!
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <TextField
              fullWidth
              label="Enter PIN"
              type={showPin ? 'text' : 'password'}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              error={!!error}
              helperText={error}
              size="medium"
            />
            <Button onClick={() => setShowPin(!showPin)}>
              {showPin ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </Button>
          </Box>
          <Button variant="contained" onClick={login} fullWidth>
            Login
          </Button>
        </Paper>
      ) : (
        <Paper sx={{ p: 3, border: '1px solid #ddd' }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Configurations:
          </Typography>

          {loading ? (
            <Box sx={{ py: 2 }}>
              <Typography>Loading...</Typography>
            </Box>
          ) : (
            <>
              <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography fontWeight="bold">Rate per unit</Typography>
                  {!editRate ? (
                    <Button 
                      size="small" 
                      variant="contained" 
                      onClick={() => setEditRate(true)}
                      sx={{ bgcolor: '#1976d2', color: 'white' }}
                    >
                      Update
                    </Button>
                  ) : (
                    <Button 
                      size="small" 
                      variant="outlined" 
                      onClick={() => setEditRate(false)}
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
                
                {!editRate ? (
                  <Typography variant="h6">৳{showNum(config?.rate_per_unit)}</Typography>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
                    <TextField
                      size="small"
                      placeholder="New rate"
                      value={newRate}
                      onChange={(e) => setNewRate(e.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <Button 
                      variant="contained" 
                      size="small" 
                      onClick={saveRate}
                      disabled={saving === 'rate'}
                      sx={{ bgcolor: '#1976d2', color: 'white' }}
                    >
                      {saving === 'rate' ? '...' : 'Save'}
                    </Button>
                  </Box>
                )}
              </Box>

              <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography fontWeight="bold">VAT %</Typography>
                  {!editVat ? (
                    <Button 
                      size="small" 
                      variant="contained" 
                      onClick={() => setEditVat(true)}
                      sx={{ bgcolor: '#1976d2', color: 'white' }}
                    >
                      Update
                    </Button>
                  ) : (
                    <Button 
                      size="small" 
                      variant="outlined" 
                      onClick={() => setEditVat(false)}
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
                
                {!editVat ? (
                  <Typography variant="h6">{showNum(config?.vat_percentage)}%</Typography>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
                    <TextField
                      size="small"
                      placeholder="New VAT %"
                      value={newVat}
                      onChange={(e) => setNewVat(e.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <Button 
                      variant="contained" 
                      size="small" 
                      onClick={saveVat}
                      disabled={saving === 'vat'}
                      sx={{ bgcolor: '#1976d2', color: 'white' }}
                    >
                      {saving === 'vat' ? '...' : 'Save'}
                    </Button>
                  </Box>
                )}
              </Box>

              <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography fontWeight="bold">Service charge</Typography>
                  {!editService ? (
                    <Button 
                      size="small" 
                      variant="contained" 
                      onClick={() => setEditService(true)}
                      sx={{ bgcolor: '#1976d2', color: 'white' }}
                    >
                      Update
                    </Button>
                  ) : (
                    <Button 
                      size="small" 
                      variant="outlined" 
                      onClick={() => setEditService(false)}
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
                
                {!editService ? (
                  <Typography variant="h6">৳{showNum(config?.fixed_service_charge)}</Typography>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
                    <TextField
                      size="small"
                      placeholder="New service charge"
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <Button 
                      variant="contained" 
                      size="small" 
                      onClick={saveService}
                      disabled={saving === 'service'}
                      sx={{ bgcolor: '#1976d2', color: 'white' }}
                    >
                      {saving === 'service' ? '...' : 'Save'}
                    </Button>
                  </Box>
                )}
              </Box>
            </>
          )}

          {ok && <Alert severity="success" sx={{ mt: 2, py: 0 }}>Saved</Alert>}
          {error && <Alert severity="error" sx={{ mt: 2, py: 0 }}>{error}</Alert>}
        </Paper>
      )}
    </Box>
  );
};