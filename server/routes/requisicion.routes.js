const express = require('express');

const Requisicion = require('../database/models/requisicion.model');
const isolicitud = require('../database/models/isolicitud.modal');
const iasignacion = require('../database/models/iasignacion.modal');
const {NuevaRequisicion, NuevaRequisicion_ } = require('../middlewares/emails/requisicion.email')
const {FAL004} = require('../middlewares/docs/FAL-004.pdf');

const app = express();

app.post('/api/requi',(req, res)=>{

    const body = req.body;

    let requi = new Requisicion({
        sort:body.sort,
        motivo:body.motivo,
        producto:body.producto,
        usuario:body.usuario
    })
    
    requi.save((err, resp)=>{
        if( err ){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        if(body.sort === "#"){
            NuevaRequisicion_(body.sort,'jaime.sanjuan@poligraficaindustrial.com',body.motivo)
        }else{
            NuevaRequisicion(body.sort,'jaime.sanjuan@poligraficaindustrial.com',body.motivo)
        }
        //console.log(resp)
        res.json('ok')
    });
        

});

app.get('/api/requi', (req, res)=>{
    Requisicion.find({estado:'lista'})
                .populate('producto.materiales.producto')
                .populate({path: 'producto', populate:{path:'materiales.producto', populate:{path:'grupo'}}})
                .exec((err, requi)=>{
                    if( err ){
                        return res.status(400).json({
                            ok:false,
                            err
                        });
                    }

                    res.json(requi)
                })
})

app.get('/api/requi/espera', (req, res)=>{
    Requisicion.find({estado:'Espera'})
                .populate('producto.materiales.producto')
                .populate({path: 'producto', populate:{path:'materiales.producto', populate:{path:'grupo'}}})
                .exec((err, requi)=>{
                    if( err ){
                        return res.status(400).json({
                            ok:false,
                            err
                        });
                    }

                    res.json(requi)
                })
})

app.delete('/api/requi/:id', (req, res)=>{
    let id = req.params.id;

    Requisicion.findByIdAndDelete(id, (err, requi)=>{
        if( err ){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json(requi)
    })
})

app.put('/api/requi/:id', (req,res)=>{
    let id = req.params.id;

    let num_solicitud;
    let tabla = '';

    isolicitud.findByIdAndUpdate({_id: 'iterator'}, {$inc: {seq: 1}}, {new: true, upset:true})
                .exec((err, solicitud)=>{
                    if( err ){
                        return res.status(400).json({
                            ok:false,
                            err
                        });
                    }

                    num_solicitud = solicitud.seq;
                })

    iasignacion.findByIdAndUpdate({_id: 'iterator'}, {$inc: {seq: 1}}, {new: true, upset:true})
                .exec((err, asignacion)=>{
                    if( err ){
                        return res.status(400).json({
                            ok:false,
                            err
                        });
                    }

                    Requisicion.findByIdAndUpdate(id, {estado:'lista', solicitud:asignacion.seq})
                    .populate('producto.materiales.producto')
                    .populate({path: 'producto', populate:{path:'materiales.producto', populate:{path:'grupo'}}})
                    .exec((err, requi)=>{
                        if( err ){
                            return res.status(400).json({
                                ok:false,
                                err
                            });
                        }

                    
                    let material = []
                    let cantidad = []
                    let producto_ = requi.producto.materiales[0];

                    // //console.log(producto_, 'aja')

                    for(let i=0; i< producto_.length ; i++){
                        let nombre = `${producto_[i].producto.nombre} (${producto_[i].producto.marca})`;
                        let cant = `${producto_[i].cantidad} ${producto_[i].producto.unidad}`;
                        if(producto_[i].producto.ancho){
                            nombre = `${producto_[i].producto.nombre} ${producto_[i].producto.ancho}x${producto_[i].producto.largo} (${producto_[i].producto.marca}) Calibre: ${producto_[i].producto.calibre}, Gramaje: ${producto_[i].producto.gramaje}`;
                        }
                        material.push(nombre);
                        cantidad.push(cant)

                        if(nombre != undefined){
                            let data = `<tr><td>${nombre}</td><td>${cant}</td></tr>`;
                            tabla = tabla + data;
                        }

                        let final = producto_.length -1;
                        if(i == final){ 
                            console.log(tabla)
                            FAL004(requi.producto.producto,requi.sort, num_solicitud,material,cantidad,requi.usuario,requi.motivo,tabla)
                        }
                    }
                    
                    // //console.log(requi.producto.materiales[0][0].producto)

                
                        res.json(requi)
                    })

                })

    
})

module.exports = app;