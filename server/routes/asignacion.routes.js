const express = require('express');
const app = express();

const Orden = require('../database/models/orden.model');
const Almacenado = require('../database/models/almacenado.model');
const Iasignacion = require('../database/models/iasignacion.modal')
const Lotes = require('../database/models/lotes.model')
const Requisicion = require('../database/models/requisicion.model')

const {FAL005} = require('../middlewares/docs/FAL-005.pdf')

app.get('/api/orden-especifica', (req, res)=>{

    Orden.find({estado:'Espera'})
        .populate('cliente')
        .populate('producto.grupo')
        .populate('producto.cliente')
        .populate('producto.materiales')
        .populate({path:'producto', populate:{path:'materiales.producto'}})
        .populate({path:'producto.materiales.producto', populate:{path:'grupo'}})
        .exec((err, orden)=>{
            
            if( err ){
                return res.status(400).json({
                    ok:false,
                    err
                });
            }

            for(let x=0;x<orden.length;x++){
                for(let i=0;i<orden[x].producto.materiales[orden[x].montaje].length;i++){
                    let material = orden[x].producto.materiales[orden[x].montaje][i]
                    if(material.producto.grupo.nombre != 'Sustrato' && material.cantidad === '0'){
                        orden[x].producto.materiales[orden[x].montaje].splice(i,1)
                        i--
                    }
                        if(x === orden.length-1 && i === orden[x].producto.materiales[orden[x].montaje].length -1){
                            res.json(orden)
                        }
                    
                }
                
            }
        })

})


app.post('/api/buscar-en-almacen', (req, res)=>{
    
    let parametros = req.body
    console.log(parametros)

    Almacenado.find(parametros)
        .populate({
            path: 'material',
            populate: {
                path: 'grupo'
            }
        })
        .exec((err, almacen)=>{
            res.json(almacen)
        })

})

app.get('/api/buscar-por-nombre', (req, res)=>{

    Almacenado.find({$and:[{cantidad:{ $gt:0}}, {cantidad:{$ne:'0.00'}}]}) 
        .populate({
            path: 'material',
            populate: {
                path: 'grupo'
            }
        })
        .exec((err, almacen)=>{

            for(let i=0;i<almacen.length;i++){
                if(!almacen[i].material){
                    almacen.splice(i, 1)
                    i--
                }
            
            if(i == almacen.length -1){
                res.json(almacen)   
            }
                
            }



        })
})

app.get('/api/buscar-cinta', (req, res)=>{

    Almacenado.find({$and:[{cantidad:{ $gt:0}}, {cantidad:{$ne:'0.00'}}]})
        .populate({
            path: 'material',
            populate: {
                path: 'grupo'
            }
        })
        .exec((err, almacen)=>{

            let cinta = []

            for(let i=0;i<almacen.length;i++){
                if(!almacen[i].material){
                    almacen.splice(i, 1)
                    i--
                }else{

                    if(almacen[i].material.grupo.nombre === 'Cinta de Embalaje'){
                        cinta.push(almacen[i])
                    }

                }
            
            if(i == almacen.length -1){
                res.json(cinta)   
            }
                
            }



        })
})

app.post('/api/descontar', (req, res)=>{
    let body = req.body;

    let N_asignacion;
    let lotes = [];
    let Requi = false;


    if(body.requi){
        Requi = true
        Requisicion.findOneAndUpdate({_id:body.orden_id},{estado:'Finalizado'}, (err, requi)=>{
            if( err ){
                return res.status(400).json({
                    ok:false,
                    err
                });
            }
        })

    }



    Orden.findOneAndUpdate({sort:body.orden}, {estado:'activo'}, (err, modificado)=>{
        if( err ){
            return res.status(400).json({
                ok:false,
                err
            });
    }
    })


    Iasignacion.findByIdAndUpdate({_id: 'iterator'}, {$inc: {seq: 1}}, {new: true, upset:true}, (err, asig)=>{
        if( err ){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        N_asignacion = asig.seq
    })
    
    for(let i=0;i<body.ids.length;i++){

        Almacenado.updateOne({_id:body.ids[i]}, {cantidad:body.restantes[i]}, (err, almacenadoDB) =>{
            if( err ){
                return res.status(400).json({
                    ok:false,
                    err
                });
            }

            let lote = {
                asignacion:N_asignacion,
                material:body.producto[i],
                lote:body.lotes[i],
                codigo:body.codigos[i],
                cantidad:body.cantidad[i],
                EA_cantidad:body.EA_cantidad[i]
            }

            lotes.push(lote)

            console.log(`lote:${body.lotes[i]} codigo:${body.codigos[i]} - EA:${body.EA_cantidad[i]} updated to ${body.restantes[i]}`)
            
            if(i == body.ids.length - 1){
                setTimeout(() => {
                    console.log('asignacion: ',N_asignacion)
                    let NewLote = {
                        asignacion:N_asignacion,
                        orden:body.orden,
                        material:lotes
                    }
                    let lotes_ = new Lotes(NewLote).save((err, loteDB)=>{
                        if( err ){
                            return res.status(400).json({
                                ok:false,
                                err
                            });
                        }
    
                        console.log(`se registro nuevo lote: ${loteDB}`)
                        FAL005(body.orden, N_asignacion, body.tabla, body.materiales, body.lotes, body.cantidades,Requi)
                        res.json('done')
                    })
                  }, 1000);
            }
        })
    
    }


})


module.exports = app;