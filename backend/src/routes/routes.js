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
routes.put('/mesas/:id', MesaController.update);
routes.delete('/mesas/:id', MesaController.delete);
routes.patch('/mesas/:id/inativar', MesaController.inativar);

// --- Rotas de Cliente ---
routes.post('/clientes', ClienteController.store);
routes.get('/clientes', ClienteController.index);
routes.get('/clientes/:id', ClienteController.show);
routes.put('/clientes/:id', ClienteController.update);
routes.delete('/clientes/:id', ClienteController.delete);

// --- Rotas de Cidade ---
routes.post('/cidades', CidadeController.store);
routes.get('/cidades', CidadeController.index);
routes.get('/cidades/:id', CidadeController.show);
routes.delete('/cidades/:id', CidadeController.delete);

// --- Rotas de Distrito ---
routes.post('/distritos', DistritoController.store);
routes.get('/distritos', DistritoController.index);
routes.get('/cidades/:cidadeId/distritos', DistritoController.indexByCidade);
routes.get('/distritos/:id', DistritoController.show);
routes.delete('/distritos/:id', DistritoController.delete);

// --- Rotas de Leitura de Mesa ---
routes.post('/leituras', LeituraMesaController.store);
routes.get('/mesas/:mesaId/leituras', LeituraMesaController.indexByMesa);
routes.delete('/leituras/:id', LeituraMesaController.delete);

// --- Rotas de Dashboard ---
routes.get('/dashboard', DashboardController.index);
routes.get('/dashboard/lucro-por-distrito', DashboardController.lucroPorDistrito);

module.exports = routes;