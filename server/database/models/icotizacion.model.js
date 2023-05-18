const mongoose = require('mongoose');

let Schema = mongoose.Schema;

var Icotizacionschema = new mongoose.Schema({
    _id: {type: String, required:true},
    seq: {type: Number, default: 0001}
});

module.exports = mongoose.model('icotizacion', Icotizacionschema)