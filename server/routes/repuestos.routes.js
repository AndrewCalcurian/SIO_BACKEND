const express = require('express');
const app = express();
const Categoria = require('../database/models/categoria.model');
const Repuesto = require('../database/models/repuesto.model');
const Pieza = require('../database/models/piezas.model');


app.post('/api/categoria', (req, res) =>{
    let body = req.body;

    let Categoria_ = new Categoria(body)

    Categoria_.save((err, CategoriaDB)=>{
        res.json({
            categorias:CategoriaDB
        })
    })
})

app.get('/api/categoria', (req, res)=>{
    Categoria.find({}, (err, CategoriaDB)=>{
        if( err ){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        res.json({
            categorias:CategoriaDB
        })
    })
})

app.post('/api/repuesto', (req, res) =>{
    let body = req.body;
    let Repuesto_ = new Repuesto(body)

    Repuesto.findOne({ nombre: body.nombre, categoria: body.categoria, maquina:body.maquina }, (err, repuesto) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } else if (repuesto) {
            res.json({
                error:{
                    mensaje:'Este repuesto ya existe en la base de datos'
                }
            })
            return 
        }

        Repuesto_.save((err, RepuestoDB)=>{
            if( err ){
                return res.status(400).json({
                    ok:false,
                    err
                });
            }
            res.json({
                repuesto:RepuestoDB
            })
        })
    })
})

app.put('/api/repuesto/:id', (req, res) => {
    const { _id, ...body } = req.body;

    Repuesto.updateOne({ _id: req.params.id }, body, (err, RepuestoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            repuesto: RepuestoDB
        });
    });
});

app.get('/api/repuesto', (req, res)=>{
    Repuesto.find({}, (err, RepuestoDB)=>{
        if( err ){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        res.json({
            repuesto:RepuestoDB
        })
    })
})

app.post('/api/pieza', (req, res) =>{
    let body = req.body;
    let Pieza_ = new Pieza(body)

    Pieza_.save((err, PiezaDB)=>{
        if( err ){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        res.json({
            pieza:PiezaDB
        })
    })
})

app.put('/api/pieza/:id', (req, res) =>{
    const { _id, ...body } = req.body;

    Pieza.updateOne({ _id: req.params.id }, body, (err, PiezaDB)=>{
        if( err ){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        res.json({
            pieza:PiezaDB
        })
    })
})

app.get('/api/pieza', (req, res)=>{
    Pieza.find()
        .populate('repuesto')
        .exec((err, piezaDB)=>{
        if( err ){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        res.json({
            pieza:piezaDB
        })
    })
})

module.exports = app;