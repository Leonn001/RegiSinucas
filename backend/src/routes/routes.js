const { Router } = require('express');
const MesaController = require('../controllers/MesaController');
const CidadeController = require('../controllers/CidadeController');
const DistritoController = require('../controllers/DistritoController');
const ClienteController = require('../controllers/ClienteController');

const routes = new Router();

// --- Rotas de Mesa ---
routes.get('/mesas', MesaController.index);
routes.post('/mesas', MesaController.store);
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

module.exports = routes;