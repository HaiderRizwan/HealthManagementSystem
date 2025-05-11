import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Switch, FormControlLabel } from '@mui/material';
import { toggleApiEnvironment, getApiEnvironmentName } from '../config/api';

const ApiToggle = () => {
  const [apiEnv, setApiEnv] = useState(getApiEnvironmentName());
  const [checked, setChecked] = useState(localStorage.getItem('useLocalApi') === 'true');

  const handleToggle = () => {
    const isLocal = toggleApiEnvironment();
    setApiEnv(getApiEnvironmentName());
    setChecked(isLocal);
    // Reload the page to apply changes
    window.location.reload();
  };

  return (
    <Box sx={{ 
      position: 'fixed', 
      bottom: '10px', 
      right: '10px', 
      zIndex: 9999,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: '8px',
      borderRadius: '4px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      display: 'flex',
      alignItems: 'center'
    }}>
      <FormControlLabel
        control={
          <Switch
            checked={checked}
            onChange={handleToggle}
            color="primary"
          />
        }
        label={
          <Typography variant="body2">
            API: <strong>{apiEnv}</strong>
          </Typography>
        }
      />
    </Box>
  );
};

export default ApiToggle; 