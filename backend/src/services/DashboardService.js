// src/services/DashboardService.js
'use strict';
const database = require('../database/index');
const { Mesa, LeituraMesa, Cidade, Distrito, Cliente  } = require('../database/index').connection.models;
const { QueryTypes } = require('sequelize');
const { fn, col } = require('sequelize');

class DashboardService {

    async getKpis() {
        const totalMesas = await Mesa.count();
        const mesasAtivas = await Mesa.count({ where: { status: 'Ativa' } });
        const mesasInativas = await Mesa.count({ where: { status: 'Inativa - Galpão' } });
        const manutencoesPendentes = await Mesa.count({ where: { precisa_manutencao: true } });

        return { totalMesas, mesasAtivas, mesasInativas, manutencoesPendentes };
    }

    async getLucroPorCidade() {
        const resultado = await LeituraMesa.findAll({
            attributes: [
                [fn('SUM', col('valor_cobrado')), 'Lucro'],
                [col('mesa->distrito->cidade.nome'), 'name'],
            ],
            include: [{
                model: Mesa,
                as: 'mesa',
                attributes: [],
                include: [{
                    model: Distrito,
                    as: 'distrito',
                    attributes: [],
                    include: [{
                        model: Cidade,
                        as: 'cidade',
                        attributes: [],
                    }]
                }]
            }],
            group: ['mesa->distrito->cidade.nome'],
            order: [[fn('SUM', col('valor_cobrado')), 'DESC']],
            raw: true,
        });

        return resultado.map(item => ({
            name: item.name,
            Lucro: parseFloat(item.Lucro)
        }));
    }

}

module.exports = new DashboardService();