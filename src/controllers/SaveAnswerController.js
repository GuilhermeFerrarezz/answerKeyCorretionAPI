import qs from 'query-string';
import db from '../models/index.js'
import { Op } from 'sequelize';
const Prova = db.Prova
const Resposta = db.Resposta

export default {
    async saveAnswer(req, res) {
        const { gabarito, respostas, ano, mes, dia, erros } = req.body
        const currentUser = JSON.parse(req.headers.user || {});
        const userId = currentUser.id
        //console.log(currentUser)

        if (!gabarito || !respostas || !mes || !dia || !ano || !userId || erros == undefined) {
            return res.status(400).json({ message: "Incomplete data" })
        }
        try {
            const provaExists = await db.Prova.findOne({
                where: {
                    userId: userId,
                    ano: ano,
                    mes: mes,
                    dia: dia,
                }
            })
            if (provaExists) {
                return res.status(409).json({
                    error: 'Você já cadastrou uma prova com esse nome'
                })
            }

            const newProva = await Prova.create(
                {
                    userId: userId,
                    ano: ano,
                    mes: mes,
                    dia: dia,
                    erros: erros,
                    resposta: {
                        respostas_usuario: respostas,
                        respostas_gabarito: gabarito
                    }
                },
                {
                    include: [{
                        model: Resposta,
                        as: 'resposta'
                    }]
                }

            )
            return res.status(201).json(newProva)
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: "Internal server error." });
        }

    },

    async findAll(req, res) {
        try {
            const year = req.query.ano
            const day = req.query.dia
            const currentUser = JSON.parse(req.headers.user || "{}");
            const userId = currentUser.id || req.userId
            //console.log(userId)
            const whereCondition = {
                userId: userId
            };
            if (year) {
                whereCondition.ano = Number(year);
            }

            if (day) {
                whereCondition.dia = Number(day);
            }

            const provas = await Prova.findAll({
                where: whereCondition,
                include: [{
                    model: Resposta,
                    as: 'resposta'
                }]
            }
            )
            return res.status(200).json(provas)
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: "Internal server error." })
        }
    },

    async findOne(req, res) {
        try {

            const currentUser = JSON.parse(req.headers.user || "{}");
            const userId = currentUser.id || req.userId
            const provaId = req.params.id
            const whereCondition = {
                userId: userId,
                id: provaId
            };

            const prova = await Prova.findOne({
                where: whereCondition,
                include: [{
                    model: Resposta,
                    as: 'resposta'
                }]
            }
            )
            if (!prova) {
                return res.status(404).json({ error: "Prova not found." });
            }
            return res.status(200).json(prova)
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: "Internal server error." })
        }
    },

    async update(req, res) {
        const provaId = req.params.id
        const { gabarito, respostas, ano, mes, dia, erros } = req.body
        //console.log(req.body)
        const currentUser = JSON.parse(req.headers.user || "{}");
        const userId = currentUser.id || req.userId;
        //console.log(currentUser)

        if (!gabarito || !respostas || !mes || !dia || !ano || !provaId || erros == undefined) {
            return res.status(400).json({ message: "Incomplete data" })
        }

        try {
            const provaExists = await Prova.findOne({
                where: {
                    id: provaId,
                    userId: userId
                }
            })
            if (!provaExists) {
                return res.status(409).json({
                    error: 'Prova does not exist'
                })
            }
            await Prova.update(
                { ano: ano, mes: mes, dia: dia, erros: erros },
                { where: { id: provaId, userId: userId } }
            );
            await Resposta.update(
                {
                    respostas_usuario: respostas,
                    respostas_gabarito: gabarito
                },
                { where: { provaId: provaId } }

            )

            const provaAtualizada = await Prova.findOne({
                where: { id: provaId },
                include: [{ model: Resposta, as: 'resposta' }]
            })


            return res.status(200).json(provaAtualizada);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: "Internal server error." });
        }

    },


    async remove(req, res) {
        try {
            const currentUser = JSON.parse(req.headers.user || "{}");
            const userId = currentUser.id || req.userId
            const provaId = req.params.id
            const whereCondition = {
                userId: userId,
                id: provaId
            };

            const prova = await Prova.findOne({
                where: whereCondition,
            }
            )
            if (!prova) {
                return res.status(404).json({ error: "Prova not found." });
            }

            await prova.destroy()


            return res.status(200).send('Prova succesfully deleted')
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: "Internal server error." })
        }





    }
}



















