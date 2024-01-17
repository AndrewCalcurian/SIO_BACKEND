const mongoose = require('mongoose');

let Schema = mongoose.Schema;

var IRepuestoschema = new mongoose.Schema({
    _id: {type: String, required:true},
    seq: {type: Number, default: 240000}
});

module.exports = mongoose.model('irepuestos', IRepuestoschema)