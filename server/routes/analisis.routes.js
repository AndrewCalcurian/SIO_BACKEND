const express = require('express');
const app = express();

const almacenado = require('../database/models/almacenado.model')
const Lote = require('../database/models/lotes.model')

app.get('/api/analisis/:lote', (req, res)=>{

    let lote = req.params.lote

    almacenado.find({lote})
        .populate('material')
        .exec((err, almacenado)=>{
        if( err ){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json(almacenado)
    })
})


app.get('/api/verlote/:lote', (req, res)=>{
    let lote = req.params.lote

    Lote.find({_id:lote})
        .populate('material.material')
        .exec((err, _lote)=>{
            if( err ){
                return res.status(400).json({
                    ok:false,
                    err
                });
            }

            let materiales=[]

            for(let i=0; i<_lote[0].material.length;i++){
                materiales.push(`${_lote[0].material[i].material.nombre} / cantidad:${_lote[0].material[i].cantidad}`)
            }

            res.json(materiales)
        })
})

module.exports = app;