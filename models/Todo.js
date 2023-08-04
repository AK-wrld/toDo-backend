const mongoose = require('mongoose');
const { Schema } = mongoose;
const TodoSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    name: {
        type: String,
        required: true,
        
    },
    desc: {
        type: String,
       
        
    },
    status: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default : Date.now
    }
    
  });
  const Todo = mongoose.model('todo',TodoSchema)
  module.exports = Todo