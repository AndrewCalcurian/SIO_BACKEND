const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const Producto = require('../database/models/producto.model');



const app = express();
app.use(fileUpload());

app.put('/api/upload/:tipo/:id', (req, res)=>{

    let tipo = req.params.tipo;
    let id = req.params.id;

    if(!req.files){
        return res.status(400)
                .json({
                    ok:false,
                    err:{
                        message:'No se ah seleccionado ningun archivo'
                    }
        });
    }

    //validad tipo
    let tipoValido = ['errors', 'usuarios','producto'];
    if( tipoValido.indexOf( tipo ) < 0 ){
        return res.status( 400 ).json({
            ok:false,
            err:{
                message:'Error de url'
            }
        })
    }


    let archivo = req.files.archivo;
    let NombreSep = archivo.name.split('.');
    let extension = NombreSep[NombreSep.length - 1];

    let extensionesValidas = ['png', 'jpg', 'jpeg'];

    if(extensionesValidas.indexOf( extension ) < 0){
        return res.status( 400 ).json({
            ok:false,
            err:{
                message:'Extension de archivo no valido'
            }
        })
    }

    //cambiar nombre de la imagen
    let nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extension}`; 

    archivo.mv(`server/uploads/${tipo}/${nombreArchivo}`, (err)=>{
        if(err){
            return res.status(500)
                        .json({
                            ok:false,
                            err
            });
        }

        if(tipo === 'producto'){
            ImagenProducto(id, res, nombreArchivo);
        }else{
            ImagenProducto(id, res, nombreArchivo);
        }

    });

});


function ImagenProducto(id, res,nombreArchivo){

    Producto.findById(id,(err,usuarioDB)=>{
        if( err ){
            borrarArchivo(nombreArchivo, 'producto')
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!usuarioDB){
            borrarArchivo(nombreArchivo, 'producto')
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'usuario no existe'
                }
            });
        }
        
        borrarArchivo(usuarioDB.img, 'producto')

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, imageUpdated)=>{

            res.json({
                ok:true,
                usuario:usuarioDB,
                img:nombreArchivo
            })


        });

    });

}

function borrarArchivo(nombreArchivo, tipo){
    let pathImage = path.resolve(__dirname, `../uploads/${ tipo }/${ nombreArchivo }`);

        if( fs.existsSync(pathImage) ){
            fs.unlinkSync(pathImage)
        }
}

module.exports = app;