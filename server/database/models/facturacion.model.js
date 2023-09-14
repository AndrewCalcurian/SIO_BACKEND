const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let FacturacionSchema = new Schema([{
    status:{
        type:String,
        default:'Por notificar'
    },
    factura:{
        type:String,
        required:true
    },
    orden:{
        type:String,
    },
    transportista:{
        type:String,
    },
    productos:{
        type:Array,
    },
    totales:{
        type:Array,
    },
    condicion:{
        type:Array,
    },
    proveedor:{
        type:Schema.Types.ObjectId,
        ref: 'proveedor'
    }

}])
module.exports = mongoose.model('facturacion', FacturacionSchema)