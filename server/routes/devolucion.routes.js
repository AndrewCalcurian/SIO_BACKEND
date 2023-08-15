const express = require('express');
const app = express();

const Devolucion = require('../database/models/devolucion.model');
const Almacenado = require('../database/models/almacenado.model');
const Lote = require('../database/models/lotes.model')
const Material = require('../database/models/material.model')
const idevolucion = require('../database/models/idevolucion.model')

const {FAL006} = require('../middlewares/docs/FAL-006.pdf');

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

    Devolucion.findByIdAndUpdate(id, {status:'Culminado'},(err, devolucionDB)=>{
    // Devolucion.findByIdAndUpdate(id, {_id:id},(err, devolucion)=>{
        if( err ){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        let lotes = []
        let materiales = []
        let cantidades = []
        let tabla = '';
        for(let i = 0; i<body.length; i++){
            Almacenado.find({material:body[i].material._id,
                                        lote:body[i].lote,
                                        codigo:body[i].codigo},
                                        (error, almacenado)=>{
                                            if( error ){
                                                return res.status(400).json({
                                                    ok:false,
                                                    error
                                                });
                                            }

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
            
            for(let i = 0; i<body.length; i++){
                lotes.push(body[i].lote)
                Material.findById(body[i].material, (err, material)=>{
                    if( err ){
                        return res.status(400).json({
                            ok:false,
                            err
                        });
                    }
        
                    // //console.log(material.nombre)
                let data = '';
                cantidades.push(`${body[i].cantidad} ${material.unidad}`)
                if(!material.ancho){
                    if(material.grupo == '61fd54e2d9115415a4416f17' || material.grupo == '61fd6300d9115415a4416f60'){
                        materiales.push(`${material.nombre} (${material.marca}) - Lata:${body[i].codigo}`)
                        data = `<tr><td>${material.nombre} (${material.marca}) - Lata:${body[i].codigo}</td>
                        <td>${body[i].cantidad} ${material.unidad}</td></tr>`;
                    }else{
                        materiales.push(`${material.nombre} (${material.marca})`)
                        data = `<tr><td>${material.nombre} (${material.marca})</td>
                        <td>${body[i].cantidad} ${material.unidad}</td></tr>`;
                    }
                }else{
                    materiales.push(`${material.nombre} ${material.ancho}x${material.largo} (${material.marca}) - Paleta:${body[i].codigo}`)
                    data = `<tr><td>${material.nombre} ${material.ancho}x${material.largo} (${material.marca}) - Paleta:${body[i].codigo}</td>
                    <td>${body[i].cantidad} ${material.unidad}</td></tr>`;
                }
        
                tabla = tabla + data;
                if(i === final){
        
                    idevolucion.findByIdAndUpdate({_id: 'test'}, {$inc: {seq: 1}}, {new: true, upset:true})
                        .exec((err, devolucion)=>{
                            if( err ){
                                return res.status(400).json({
                                    ok:false,
                                    err
                                });
                            }
        
                            num_solicitud = devolucion.seq;
                            // FAL006(body.orden,num_solicitud,materiales,lotes, cantidades, body.motivo, body.usuario,tabla)
                            // let newDEvolucion = new Devolucion({
                            //     orden:body.orden,
                            //     filtrado:body.filtrado,
                            //     motivo:body.motivo
                            // }).save();
                            FAL006(devolucionDB.orden,num_solicitud,materiales,lotes, cantidades, devolucionDB.motivo, devolucionDB.usuario,tabla)
                            res.json('done');
                        })
                }
        
                })
        
            }
            // res.json(devolucion)
        }
        }

    })

});


app.get('/devolucion/:id', (req, res)=>{
    let id = req.params.id
    Lote.find({_id:id}, (err, Lote)=>{
        if( err ){
            return res.status(400).json({
                ok:false,
                err
            });
        }


        for(let i=0;i<Lote[0].material.length;i++){

            let mat_ = Lote[0].material[i]

            Almacenado.findOneAndUpdate({lote:mat_.lote, codigo:mat_.codigo}, {cantidad:mat_.EA_Cantidad}, (err, almacenDB)=>{
                if( err ){
                    return res.status(400).json({
                        ok:false,
                        err
                    });
                }

                console.log(almacenDB.cantidad, mat_.EA_Cantidad)
            })

            // console.log(i+1, mat_.lote, mat_.codigo, mat_.EA_Cantidad)
        }

        res.json({ok:true})

    })
})

module.exports = app;