const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let MateriaSchema = new Schema([{

    producto:{
        type:String,
        required:true
    },
    cantidad:{
        type:String,
        required:true
    },
    fecha:{
        type:String,
        required:true
    }
}]);


module.exports = mongoose.model('materia', MateriaSchema)