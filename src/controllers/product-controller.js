'use strict';

const validationContract = require('../validators/fluent-validator');
const repository = require('../repositories/product-repository')
const config = require('../config');

const azure = require("azure-storage");
const guid = require('guid');

exports.get = async (req, res, next) => {
    try {
        const data = await repository.get();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição!'
        })
    }
};

exports.getBySlug = async (req, res, next) => {
    try {
        const data = await repository.getBySlug(req.params.slug);
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição!'
        })
    }
};

exports.getById = async (req, res, next) => {
    try {
        const data = await repository.findById(req.params.id);
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição!'
        })
    }
};

exports.getBytag = async (req, res, next) => {
    try {
        const data = await repository.find(req.params.tag);
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição!'
        })
    }
};

exports.post = async (req, res, next) => {
    let contract = new validationContract();
    contract.hasMinLen(req.body.title, 3, 'O título deve conter ao menos 3 caracteres!');
    contract.hasMinLen(req.body.slug, 3, 'O slug deve conter ao menos 3 caracteres!');
    contract.hasMinLen(req.body.description, 3, 'A descrição deve conter ao menos 3 caracteres!');

    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {
        const blobSvc = azure.createBlobService(config.containerConnectionString);
        let filename = guid.raw().toString() + '.jpg';
        let rawdata = req.body.image;
        let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let type = matches[1];
        let buffer = new Buffer(matches[2], 'base64');

        // Salva a imagem
        await  blobSvc.createAppendBlobFromText('product-images', filename, buffer, {
            contentType: type
        }, (error, result, response) => {
            console.log(error);
            if (error) {
                filename = 'default-product.jpg';
            }
        });

        await repository.create({
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            price: req.body.price,
            active: true,
            tags: req.body.tags,
            image: "https://ksnodestr.blob.core.windows.net/product-images/" + filename
        });

        res.status(201).send({
            message: 'Produto cadastrado com sucesso!'
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Falha ao processar sua requisição!'
        })
    }
};

exports.put = async (req, res, next) => {
    try {
        await repository.update(req.params.id, req.body);
        res.status(200).send({
            message: 'Produto atualizado com sucesso!'
        });
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição!'
        })
    }
}

exports.delete = async (req, res, next) => {
    try {
        await repository.delete(req.body.id);
        res.status(200).send({
            message: 'Produto removido com sucesso!'
        });
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição!'
        })
    }
}
