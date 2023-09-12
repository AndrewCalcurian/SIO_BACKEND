const express = require('express');
const app = express();


const facturacion = require('../database/models/facturacion.model')

app.post('/api/facturacion', (req, res)=>{
    let body = req.body;

    let fc = new facturacion(body).save((err, factura)=>{
        if( err ){
            return res.status(400).json({
                ok:false,
                err
                });
        }

        res.json(factura)
    })
})

app.get('/api/facturacion', (req, res)=>{
    
    facturacion.find({}, (err, facturas)=>{
        if( err ){
            return res.status(400).json({
                ok:false,
                err
                });
        }

        res.json(facturas)
    })
})

app.put('/api/facturacion/:id', (req, res)=>{
    let body = req.body;
    let id = req.params.id
    facturacion.findByIdAndUpdate(id, body, (err, facturas)=>{
        if( err ){
            return res.status(400).json({
                ok:false,
                err
                });
        }

        res.json(facturas)
    })
})


module.exports = app;