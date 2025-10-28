import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, Box, Tabs, Tab, Menu, MenuItem, Button
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AssessmentIcon from '@mui/icons-material/Assessment';


function Navbar() {
    const { user, signOut } = useAuth();
    const location = useLocation();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        handleClose();
        signOut();
    };

    let currentTab = location.pathname;

    if (currentTab.startsWith('/mesas/')) {
        currentTab = '/mesas';
    }

    const validTabs = ['/dashboard', '/mesas', '/clientes', '/localizacoes', '/relatorios'];
    if (location.pathname === '/') {
        currentTab = '/dashboard';
    } else if (!validTabs.includes(currentTab)) {
        currentTab = false;
    }

    return (
        <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: 'white' }}>
            <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ p: 1, bgcolor: '#007bff', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ViewInArIcon sx={{ color: 'white' }} />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ color: '#007bff', fontWeight: 'bold', lineHeight: 1.1 }}>
                            RegiSinucas
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: -0.5 }}>
                            Sistema de Gestão
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

                    <Button
                        color="inherit"
                        onClick={handleClick}
                        endIcon={<ArrowDropDownIcon />}
                        sx={{ textTransform: 'none', p: 0.5, textAlign: 'right' }}
                    >
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                                {user?.nome || 'Administrador'}
                            </Typography>
                        </Box>
                    </Button>

                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        <MenuItem onClick={handleLogout}>
                            <LogoutIcon sx={{ mr: 1.5, fontSize: '1.25rem' }} />
                            Sair
                        </MenuItem>
                    </Menu>

                </Box>
            </Toolbar>

            <Tabs
                value={currentTab}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
                sx={{ borderTop: '1px solid #e0e0e0' }}
            >
                <Tab
                    label="Dashboard"
                    value="/dashboard"
                    icon={<DashboardIcon />}
                    iconPosition="start"
                    component={Link}
                    to="/dashboard"
                    sx={{ textTransform: 'none', fontWeight: 500 }}
                />
                <Tab
                    label="Mesas"
                    value="/mesas"
                    icon={<DashboardIcon />}
                    iconPosition="start"
                    component={Link}
                    to="/mesas"
                    sx={{ textTransform: 'none', fontWeight: 500 }}
                />
                <Tab
                    label="Clientes"
                    value="/clientes"
                    icon={<PeopleIcon />}
                    iconPosition="start"
                    component={Link}
                    to="/clientes"
                    sx={{ textTransform: 'none', fontWeight: 500 }}
                />
                <Tab
                    label="Localizações"
                    value="/localizacoes"
                    icon={<LocationOnIcon />}
                    iconPosition="start"
                    component={Link}
                    to="/localizacoes"
                    sx={{ textTransform: 'none', fontWeight: 500 }}
                />
                <Tab
                    label="Relatórios"
                    value="/relatorios"
                    icon={<AssessmentIcon />}
                    iconPosition="start"
                    component={Link}
                    to="/relatorios"
                    sx={{ textTransform: 'none', fontWeight: 500 }}
                />
            </Tabs>
        </AppBar>
    );
}

export default Navbar;