import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
    Box, TextField, Button, Typography, Paper, Alert, Grid,
    InputAdornment
} from '@mui/material';

// --- Ícones ---
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import BarChartIcon from '@mui/icons-material/BarChart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Componente helper para a lista de features (coluna da direita)
function FeatureItem({ text }) {
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            bgcolor: 'rgba(255, 255, 255, 0.1)', // Fundo translúcido
            p: 2,
            borderRadius: 2,
            width: '100%',
        }}>
            <CheckCircleIcon sx={{ color: 'white' }} />
            <Typography variant="body1" color="white" sx={{ fontSize: '0.9rem' }}>
                {text}
            </Typography>
        </Box>
    );
}


function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { signIn } = useAuth();

    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');
        try {
            await signIn(email, password);
        } catch (err) {
            const apiError = err.response?.data?.error;
            setError(apiError || err.message || 'Erro desconhecido.');
        }
    };

    return (
        // 1. O container da PÁGINA INTEIRA (fundo cinza)
        //    Ele centraliza o conteúdo na vertical e horizontal.
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                bgcolor: 'grey.100', // O fundo cinza da imagem de referência
                p: 2 // Padding para o card não colar nas bordas em telas pequenas
            }}
        >
            {/* 2. O CARD PRINCIPAL (centralizado) */}
            {/* Este Paper vai conter as 2 colunas. */}
            <Paper
                elevation={6}
                sx={{
                    p: 0, // O padding será controlado pelos Grid items
                    borderRadius: 2, // Bordas arredondadas como na referência
                    overflow: 'hidden', // Para o azul não vazar do card
                    maxWidth: 1000 // Largura máxima do card
                }}
            >
                <Grid container>

                    {/* 3. Coluna da Esquerda (Formulário) */}
                    <Grid
                        item
                        xs={12} // Ocupa 100% no celular
                        sm={6} // Ocupa metade em telas maiores
                        md={6}
                        sx={{
                            p: { xs: 3, sm: 4 }, // Padding interno da coluna
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}
                    >
                        <Box
                            component="form"
                            onSubmit={handleLogin}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start', // Alinha textos à esquerda
                                gap: 1.5,
                                width: '100%'
                            }}
                        >
                            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                                Bem-vindo
                            </Typography>
                            <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                                Entre com suas credenciais para acessar o sistema
                            </Typography>

                            {error && <Alert severity="error" sx={{ width: '100%', mb: 1 }}>{error}</Alert>}

                            <TextField
                                label="Email"
                                type="email"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                fullWidth
                                autoFocus
                                placeholder="seu@email.com"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                label="Senha"
                                type="password"
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                fullWidth
                                placeholder="********"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                sx={{ mt: 2, py: 1.5, fontSize: '1rem', textTransform: 'none' }}
                            >
                                Entrar
                            </Button>
                        </Box>
                    </Grid>

                    {/* 4. Coluna da Direita (Branding) */}
                    <Grid
                        item
                        xs={false} // Oculta esta coluna em telas pequenas
                        sm={6}
                        md={6}
                        sx={{
                            bgcolor: '#007bff',
                            color: 'white',
                            display: { xs: 'none', sm: 'flex' }, // Garante que só apareça de 'sm' para cima
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: { xs: 3, sm: 4 },
                            gap: 4
                        }}
                    >
                        {/* Logo e Título */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ p: 1.5, bgcolor: 'white', borderRadius: 3, display: 'flex' }}>
                                <BarChartIcon sx={{ fontSize: 48, color: '#007bff' }} />
                            </Box>
                            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
                                RegiSinucas
                            </Typography>
                            <Typography variant="h6" component="h2" sx={{ fontWeight: 300, opacity: 0.9 }}>
                                Sistema de Gestão Completo
                            </Typography>
                        </Box>

                        {/* Lista de Features */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', alignItems: 'center' }}>
                            <FeatureItem text="Gestão de mesas e leituras" />
                            <FeatureItem text="Controle de clientes e localizações" />
                            <FeatureItem text="Dashboard com métricas em tempo real" />
                        </Box>
                    </Grid>

                </Grid>
            </Paper>
        </Box>
    );
}

export default LoginPage;