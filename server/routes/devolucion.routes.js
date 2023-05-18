const express = require('express');
const app = express();

const Devolucion = require('../database/models/devolucion.model');
const Almacenado = require('../database/models/almacenado.model');

app.get('/api/devolucion', (req, res)=>{

    Devolucion.find({status:'Pendiente'})
    .populate({
        path: 'filtrado',
        populate: {
            path: 'material'
        }
    })
    .exec((err, devolucion)=>{
        if( err ){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json(devolucion)
    })

});

app.delete('/api/devoluciones/:id', (req,res)=>{
     const id = req.params.id

     Devolucion.findByIdAndUpdate(id, {status:'Cancelado'}, (err, devolucion)=>{
        if( err ){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json(devolucion)
     })
})

app.put('/api/devoluciones/:id', (req, res)=>{

    const body = req.body;
    const id = req.params.id;

    Devolucion.findByIdAndUpdate(id, {status:'Culminado'},(err, devolucion)=>{
    // Devolucion.findByIdAndUpdate(id, {_id:id},(err, devolucion)=>{
        if( err ){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        for(let i = 0; i<body.length; i++){
            Almacenado.find({material:body[i].material._id,
                                        lote:body[i].lote,
                                        codigo:body[i].codigo},
                                        (error, almacenado)=>{
                                            // if( error ){
                                            //     return res.status(400).json({
                                            //         ok:false,
                                            //         error
                                            //     });
                                            // }

                                            // //console.log(almacenado[0].cantidad)
                                            let new_cantidad = 0;
                                            if(body[i].material.grupo === '61fd721fd9115415a4416f65'){
                                                new_cantidad = Number(almacenado[0].cantidad) + body[i].cantidad
                                            }else{
                                                new_cantidad = Number(almacenado[0].cantidad) + (body[i].cantidad/body[i].material.neto)
                                            }

                                            new_cantidad = Number(new_cantidad).toFixed(2)
                                            console.log(new_cantidad)


                                              Almacenado.findByIdAndUpdate(almacenado[0]._id, {cantidad:new_cantidad}, (err, almacenado_)=>{
                                               if( error ){
                                                   return res.status(400).json({
                                                       ok:false,
                                                       error
                                                   });
                                            }  
                                            })

                                        })
        
        let final = body.length -1;
        if(i === final ){   
            res.json(devolucion)
        }
        }

    })

});

module.exports = app;