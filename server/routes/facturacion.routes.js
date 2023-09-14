const express = require('express');
const app = express();


const facturacion = require('../database/models/facturacion.model')

const { reception, reception_, reception__ } = require('../middlewares/emails/nuevarecepcion.email')

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
    
    facturacion.find({})
     .populate('proveedor')
     .exec((err, facturas)=>{
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

app.get('/api/notificar-recepcion', (req, res)=>{

    Nueva_recepcion2()
    res.json('done')
})


app.get('/api/notificacion-recepcion/:id', (req, res)=>{

    let id = req.params.id

    facturacion.findByIdAndUpdate(id, {status:'Notificado'}, (err, facturacion)=>{
        for(let i=0;i<1;i++){
            console.log(i)
                let random = Math.floor(Math.random() * (9999 - 1000 + 1) ) + 1000;
                // reception('nada','calcurianandres@gmail.com,zuleima.vela@poligraficaindustrial.com','motivo de prueba',random)
                reception('nada','calcurianandres@gmail.com,zuleima.vela@poligraficaindustrial.com','motivo de prueba',random)
        }
        res.json('done')
    })

})

app.get('/api/recepcion-porconfirmar/:info/:id', (req, res)=>{

    let info = req.params.info
    let id = req.params.id

    facturacion.findByIdAndUpdate(id, {status:'Por notificar'}, (err, facturacion)=>{
        if( err ){
            return res.status(400).json({
                ok:false,
                err
                });
        }

        console.log(info)
        let random = Math.floor(Math.random() * (9999 - 1000 + 1) ) + 1000;
        reception_('nada','calcurianandres@gmail.com,zuleima.vela@poligraficaindustrial.com',random,info)
        res.json('Se envió observación para su pronta correción')
    })

})

app.get('/api/recepcion-observacion/:id', (req, res)=>{

    let id = req.params.id

    facturacion.findByIdAndUpdate(id, {status:'En Observacion'}, (err, facturacion)=>{
        if( err ){
            return res.status(400).json({
                ok:false,
                err
                });
        }

        let random = Math.floor(Math.random() * (9999 - 1000 + 1) ) + 1000;
        reception__('nada','calcurianandres@gmail.com,zuleima.vela@poligraficaindustrial.com','motivo de prueba',random)
        res.json('Se envió observación para su pronta correción')
    })

})


module.exports = app;