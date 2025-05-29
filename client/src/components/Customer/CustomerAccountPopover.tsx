// src/components/customer/CustomerAccountPopover.tsx
import { FC, useState, useRef } from 'react';
import { Avatar, Box, Button, Divider, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

export const CustomerAccountPopover: FC = () => {
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    // Implement logout logic
    console.log('Logging out...');
    handleClose();
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        ref={anchorRef}
        sx={{
          borderRadius: '50%',
          p: 0,
          minWidth: 'auto'
        }}
      >
        <Avatar
          src="/static/images/avatars/avatar_1.png"
          sx={{
            width: 40,
            height: 40
          }}
        />
      </Button>
      <Menu
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        keepMounted
        onClose={handleClose}
        open={open}
        PaperProps={{
          sx: {
            width: 220,
            mt: 1.5
          }
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="body1">John Doe</Typography>
          <Typography color="textSecondary" variant="body2">
            john.doe@example.com
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => navigate('/customer/profile')}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => navigate('/customer/settings')}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};