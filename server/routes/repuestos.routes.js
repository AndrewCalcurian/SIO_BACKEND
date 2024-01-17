const express = require('express');
const app = express();
const Categoria = require('../database/models/categoria.model');
const Repuesto = require('../database/models/repuesto.model');
const Pieza = require('../database/models/piezas.model');
const RepuestoSolicitud = require('../database/models/partesr.model')
const {FAL007} = require('../middlewares/docs/FAL-007.pdf')

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

    Pieza.findOne({ repuesto: body.repuesto, factura:body.factura }, (err, repuesto) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } else if (repuesto) {
            res.json({
                error:{
                    mensaje:'Este producto ya fué registrado con esta factura'
                }
            })
            return 
        }
    });

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

app.post('/api/solicitudrepuesto', (req, res)=>{
    const body = req.body;  

    console.log(body)

    let requisicion = new RepuestoSolicitud(body).save((Requisicion, err)=>{
        if( err ){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        res.json(Requisicion)
    })

})

app.get('/api/solicitudrepuesto', (req, res)=>{
    
    RepuestoSolicitud.find({status:'espera'}) 
                .populate('repuestos.repuesto')
                .populate({path:'repuestos.repuesto', populate:{path:'maquina'}})
                .populate({path:'repuestos.repuesto', populate:{path:'categoria'}})
                .exec((err, Requisicion)=>{
                    if( err ){
                        return res.status(400).json({
                            ok:false,
                            err
                        });
                    }
                    res.json(Requisicion)
    })

})

app.put('/api/solicitudrepuesto/:id', (req, res)=>{

    let estado = req.body.estado;
    let id = req.params.id;
    
    RepuestoSolicitud.findByIdAndUpdate(id, {status:estado}, (err, solicitud)=>{
        if( err ){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        if(estado === 'espera'){
            RepuestoSolicitud.findOne({_id:id})
                .populate('repuestos.repuesto')
                .populate({path:'repuestos.repuesto', populate:{path:'maquina'}})
                .populate({path:'repuestos.repuesto', populate:{path:'categoria'}})
                .exec((err, NewRequisicion)=>{
                    if( err ){
                        return res.status(400).json({
                            ok:false,
                            err
                        });
                    }
                    let table = '';
                    let nparte = [];
                    let repuesto = [];
                    let categoria = [];
                    let maquina = [];
                    let cantidad = [];
                    for(let i=0;i<NewRequisicion.repuestos.length;i++){
                        table = table + `<tr>
                            <td>${NewRequisicion.repuestos[i].repuesto.parte}</td>
                            <td>${NewRequisicion.repuestos[i].repuesto.nombre}</td>
                            <td>${NewRequisicion.repuestos[i].repuesto.categoria.nombre}</td>
                            <td>${NewRequisicion.repuestos[i].repuesto.maquina.nombre}</td>
                            <td>${NewRequisicion.repuestos[i].cantidad}Und</td>
                        </tr>`

                        nparte.push(NewRequisicion.repuestos[i].repuesto.parte);
                        repuesto.push(NewRequisicion.repuestos[i].repuesto.nombre);
                        categoria.push(NewRequisicion.repuestos[i].repuesto.categoria.nombre);
                        maquina.push(NewRequisicion.repuestos[i].repuesto.maquina.nombre);
                        cantidad.push(NewRequisicion.repuestos[i].cantidad)
                    
                        if(i === NewRequisicion.repuestos.length -1){
                            FAL007(table, nparte, repuesto, categoria, maquina, cantidad)
                            res.json(NewRequisicion)
                        }
                    }
    })
        }else{
            res.json(solicitud)
        }

    })



})

app.get('/prueba-formato', (req, res)=>{
    FAL007()
    res.json('send')
})

module.exports = app;