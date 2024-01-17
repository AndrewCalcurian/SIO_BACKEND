const mongoose = require('mongoose');
let Schema = mongoose.Schema;


let SolicitudParteSchema = new Schema({
  orden: { type: String, default: 'test' },
  status: { type: String, default: 'espera' },
  repuestos: [{
    repuesto:{
      type:Schema.Types.ObjectId,
      ref: 'Repuesto'
    },
    cantidad:{type:Number}
  }]
});

module.exports = mongoose.model('RepuestoSolicitud', SolicitudParteSchema);