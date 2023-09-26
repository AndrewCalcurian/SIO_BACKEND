const express = require('express');
const app = express();

const Orden = require('../database/models/orden.model');
const Almacenado = require('../database/models/almacenado.model');

app.get('/api/orden-especifica', (req, res)=>{

    Orden.find({sort:'2023061'})
        .populate('cliente')
        .populate('producto.grupo')
        .populate('producto.cliente')
        .populate('producto.materiales')
        .populate({path:'producto', populate:{path:'materiales.producto'}})
        .populate({path:'producto.materiales.producto', populate:{path:'grupo'}})
        .exec((err, orden)=>{
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


module.exports = app;