import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Typography,
  Fade
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Person as PersonIcon,
  SupervisorAccount as AdminIcon,
  LocalHospital as DoctorIcon,
  KeyboardArrowDown as ArrowDownIcon
} from '@mui/icons-material';

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: '#fff',
  textTransform: 'none',
  fontSize: '16px',
  padding: '8px 16px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  '& .MuiButton-endIcon': {
    transition: 'transform 0.3s ease',
  },
  '&[aria-expanded="true"] .MuiButton-endIcon': {
    transform: 'rotate(180deg)',
  }
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: '12px',
    marginTop: '8px',
    minWidth: 180,
    backgroundColor: '#fff',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    '& .MuiMenu-list': {
      padding: '8px',
    },
    '& .MuiMenuItem-root': {
      padding: '10px 16px',
      borderRadius: '8px',
      marginBottom: '4px',
      '&:last-child': {
        marginBottom: 0,
      },
      '&:hover': {
        backgroundColor: 'rgba(3, 38, 90, 0.04)',
      },
      '& .MuiListItemIcon-root': {
        color: '#03265a',
        minWidth: '36px',
      },
      '& .MuiListItemText-primary': {
        fontSize: '15px',
        fontWeight: 500,
      },
    },
  },
}));

const UserTypeDropdown = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const userTypes = [
    { label: 'Doctor', icon: <DoctorIcon />, path: '/auth/doctor' },
    { label: 'Client', icon: <PersonIcon />, path: '/auth/client' },
    { label: 'Admin', icon: <AdminIcon />, path: '/auth/admin' }
  ];

  return (
    <Box>
      <StyledButton
        endIcon={<ArrowDownIcon />}
        onClick={handleClick}
        aria-controls={open ? 'user-type-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DoctorIcon sx={{ fontSize: 20 }} />
          Doctor
        </Typography>
      </StyledButton>
      
      <StyledMenu
        id="user-type-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        MenuListProps={{
          'aria-labelledby': 'user-type-button',
        }}
      >
        {userTypes.map((type) => (
          <MenuItem 
            key={type.label} 
            onClick={handleClose}
            component="a"
            href={type.path}
          >
            <ListItemIcon>
              {type.icon}
            </ListItemIcon>
            <ListItemText primary={type.label} />
          </MenuItem>
        ))}
      </StyledMenu>
    </Box>
  );
};

export default UserTypeDropdown; 