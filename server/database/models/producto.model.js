const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ProductoFinal = new Schema([{
            cliente:{
                type:Schema.Types.ObjectId,
                ref: 'cliente'
            },
            img:{
                type:String
            },
            grupo:{
                type:Schema.Types.ObjectId,
                ref: 'grupo'
            },
            producto :{
                type:String
            },
            materiales: [
                [
                {
                producto:{
                    type:Schema.Types.ObjectId,
                    ref: 'material'
                },
                cantidad:{type:String}
                }
                ]
        ],
            ejemplares:{
                type:Array
            },
            post: {
                type:Array
            },
            cod_cliente: {
                type:String
            },
            codigo: {
                type:String
            },
            version: {
                type:String
            },
            edicion: {
                type:String
            },
            montajes:{
                type:Number
            }
}]);


module.exports = mongoose.model('producto', ProductoFinal)