// src/services/DashboardService.js
'use strict';
const database = require('../database/index');
const { Mesa, LeituraMesa, Cidade, Distrito, Cliente  } = require('../database/index').connection.models;
const { QueryTypes, where, Op} = require('sequelize');
const { fn, col } = require('sequelize');

class DashboardService {

    async getKpis() {
        const totalMesas = await Mesa.count();
        const mesasAtivas = await Mesa.count({ where: { status: 'Ativa' } });
        const mesasInativas = await Mesa.count({ where: { status: 'Inativa - Galpão' } });
        const manutencoesPendentes = await Mesa.count({ where: { precisa_manutencao: true } });

        return { totalMesas, mesasAtivas, mesasInativas, manutencoesPendentes };
    }

    async getLucroPorCidade({ ano, mes } = {}) {
        const whereClause = {};

        if (ano) {
            whereClause[Op.and] = [
                where(fn('EXTRACT', fn('YEAR FROM', col('LeituraMesa.data_leitura'))), ano)
            ];
        }

        if (mes) {
            whereClause[Op.and] = [
                ...(whereClause[Op.and] || []),
                where(fn('EXTRACT', fn('MONTH FROM', col('LeituraMesa.data_leitura'))), mes)
            ];
        }

        const resultado = await LeituraMesa.findAll({
            attributes: [
                [fn('SUM', col('valor_cobrado')), 'Lucro'],
                [col('mesa->distrito->cidade.nome'), 'name'],
            ],
            include: [
                {
                    model: Mesa,
                    as: 'mesa',
                    attributes: [],
                    include: [
                        {
                            model: Distrito,
                            as: 'distrito',
                            attributes: [],
                            include: [
                                {
                                    model: Cidade,
                                    as: 'cidade',
                                    attributes: [],
                                }
                            ]
                        }
                    ]
                }
            ],
            where: whereClause,
            group: ['mesa->distrito->cidade.nome'],
            order: [[fn('SUM', col('valor_cobrado')), 'DESC']],
            raw: true,
        });

        return resultado.map(item => ({
            name: item.name,
            Lucro: parseFloat(item.Lucro),
        }));
    }

}

module.exports = new DashboardService();