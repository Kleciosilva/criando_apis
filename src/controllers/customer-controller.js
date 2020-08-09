'use strict';

const validationContract = require('../validators/fluent-validator');
const repository = require('../repositories/customer-repository')
const emailService = require('../services/email-service');
const authService = require("../services/auth-service");

const md5 = require('md5');

exports.get = async (req, res, next) => {
    try {
        let data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
}

exports.post = async (req, res, next) => {
    let contract = new validationContract();
    contract.hasMinLen(req.body.name, 3, 'O nome deve conter ao menos 3 caracteres!');
    contract.isValid(req.body.email, 3, 'O email inválido!');
    contract.hasMinLen(req.body.password, 6, 'A senha deve conter ao menos 3 caracteres!');

    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {
        await repository.create({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY),
            roles: ['user']
        });

        if (global.SEND_EMAIL) {
            try {
                await emailService.send(
                    req.body.email,
                    `Bem vindo ${req.body.name}, esta é a Node Store! :)`,
                    global.EMAIL_TMPL.replace('{0}', req.body.name)
                );
            } catch (error) {
                console.log(`====> SendGrid Error ${error}`);
            }
        }

        res.status(201).send({
            message: 'Cliente cadastrado com sucesso!'
        });
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição!'
        })
    }
};

exports.authenticate = async (req, res, next) => {
    try {
        const customer = await repository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        });

        if (!customer) {
            res.status(404).send({
                message: "Usuário ou senha inválida!"
            });
            return;
        }

        const token = await authService.generateToken({
            id: customer._id,
            email: customer.email,
            name: customer.name,
            roles: customer.roles
        })

        res.status(201).send({
            token,
            data: {
                email: customer.email,
                name: customer.name
            }
        });
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição!'
        })
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        const customer = await repository.getById(data.id);

        if (!customer) {
            res.status(404).send({
                message: "Cliente não encontrado!"
            });
            return;
        }

        const tokenData = await authService.generateToken({
            id: customer._id,
            email: customer.email,
            name: customer.name,
            roles: customer.roles
        })

        res.status(201).send({
            token: tokenData,
            data: {
                email: customer.email,
                name: customer.name
            }
        });
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição!'
        })
    }
};
