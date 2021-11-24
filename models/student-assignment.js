const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const fileSchema = new Schema({
    assignment : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Assignment'
    },
    file:{
          type:String,
      },
    fileName:{
        type:String
      },
    name : {
        type:String
    },
    email : {
        type :String
    },
    rollno : {
        type :String
    }
});

module.exports = mongoose.model('StudentAssignment', fileSchema);
