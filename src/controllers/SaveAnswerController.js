import qs from 'query-string';
import db from '../models/index.js'
import { Op } from 'sequelize';
const Prova = db.Prova
const Resposta = db.Resposta

export default {
    async saveAnswer(req, res) {
        const { gabarito, respostas, ano, mes, dia } = req.body
        const currentUser = JSON.parse(req.headers.user || {});
        const userId = currentUser.id
        console.log(currentUser)
       
        if (!gabarito || !respostas || !mes || !dia || !ano) {
            return res.status(400).json({ message: "Incomplete data" })
        }
        try {
            const provaExists = await db.Prova.findOne({
                where: {
                    userId: userId,
                    ano: ano,
                    mes: mes,
                    dia: dia
                }
            })
            if (provaExists) {
                return res.status(409).json({
                    error: 'Você já cadastrou uma prova com esse nome'
                })
            }

                const newProva = await db.Prova.create(
                    {
                        userId: userId,
                        ano: ano,
                        mes: mes,
                        dia: dia,
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



    
        

    }












}
    









