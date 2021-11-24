const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const fileSchema = new Schema({
    class : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Class'
    },
    file:{
          type:String,
      },
    fileName:{
        type:String
      },
    asName : {
        type:String
    },
    description:{
        type:String
    },
    name : {
        type:String
    },
    email : {
        type :String
    }
});

module.exports = mongoose.model('Assignment', fileSchema);
