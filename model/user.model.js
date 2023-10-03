import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type:String,
        required:true,
        maxLength:15
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    contact:{
        type:Number,
        required:true
    },
    role:{
        type: String,
        enum: ["user" , "admin", "subAdmin"],
    }
  },
  {
    timestamps:true
  });

  export default mongoose.model('User',UserSchema)