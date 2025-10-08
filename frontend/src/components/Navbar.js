// src/components/Navbar.js

import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

function Navbar() {
    return (
        <AppBar position="static" color="default" elevation={1}>
            <Toolbar>
                <Typography variant="h6" color="#007bff" noWrap sx={{ flexGrow: 1 }}>
                    RegiSinucas
                </Typography>

                <Box>
                    <Button component={Link} to="/dashboard" color="inherit">Dashboard</Button>
                    <Button component={Link} to="/mesas" color="inherit">Mesas</Button>
                    <Button component={Link} to="/clientes" color="inherit">Clientes</Button>
                    <Button component={Link} to="/localizacoes" color="inherit">Localizações</Button>
                    <Button component={Link} to="/relatorios" color="inherit">Relatórios</Button>
                </Box>

                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="subtitle1">Administrador</Typography>
                    <Typography variant="body2" color="textSecondary">Gestão de Sinucas</Typography>
                </Box>

            </Toolbar>
        </AppBar>
    );
}

export default Navbar;