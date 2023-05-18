const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let MateriaPrima = new Schema([{
            fecha:{
                type:Date,
                default:Date.now
            },
            grupo:{
                type:Schema.Types.ObjectId,
                ref: 'materia' 
            },
            nombre:{
                type:String
            },
            marca:{
                type:String
            },
            ancho:{
                type:Number
            },
            largo:{
                type:Number
            },
            gramaje:{
                type:Number
            },
            calibre:{
                type:Number
            },
            cantidad:{
                type:Number
            },
            unidad: {
                type:String
            },
            presentacion: {
                type:String
            },
            neto: {
                type:Number
            },
            color:{
                type:String
            },
            cinta:{
                type:Number
            },
            // codigo: {
            //     type:String
            // },
            // lote:{
            //     type:String
            // },
            eliminado:{
                type:Boolean,
                default:false
            }

}]);


module.exports = mongoose.model('material', MateriaPrima)