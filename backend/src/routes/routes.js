const { Router } = require('express');
const MesaController = require('../controllers/MesaController');
const CidadeController = require('../controllers/CidadeController');
const DistritoController = require('../controllers/DistritoController');
const ClienteController = require('../controllers/ClienteController');
const LeituraMesaController = require('../controllers/LeituraMesaController');
const DashboardController = require('../controllers/DashboardController');

const routes = new Router();

// --- Rotas de Mesa ---
routes.get('/mesas', MesaController.index);
routes.post('/mesas', MesaController.store);
routes.get('/mesas/:id', MesaController.show);
routes.patch('/mesas/:id/devolver', MesaController.devolver);

// --- Rotas de Cliente ---
routes.post('/clientes', ClienteController.store);
routes.get('/clientes', ClienteController.index);
routes.get('/clientes/:id', ClienteController.show);

// --- Rotas de Cidade ---
routes.post('/cidades', CidadeController.store);
routes.get('/cidades', CidadeController.index);
routes.get('/cidades/:id', CidadeController.show);

// --- Rotas de Distrito ---
routes.post('/distritos', DistritoController.store);
routes.get('/distritos', DistritoController.index);
routes.get('/cidades/:cidadeId/distritos', DistritoController.indexByCidade);
routes.get('/distritos/:id', DistritoController.show);

// --- Rotas de Leitura de Mesa ---
routes.post('/leituras', LeituraMesaController.store);
routes.get('/mesas/:mesaId/leituras', LeituraMesaController.indexByMesa);

// --- Rotas de Dashboard ---
routes.get('/dashboard', DashboardController.index);
routes.get('/dashboard/lucro-por-distrito', DashboardController.lucroPorDistrito);

module.exports = routes;