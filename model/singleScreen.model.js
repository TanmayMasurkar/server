import mongoose from "mongoose";
import User from "./user.model";

const Schema = mongoose.Schema;

const SingleScreenSchema = new Schema({
    name: {
        type: String,
        maxLength: 256,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User, 
        required: true,
    },
    tvSettings: {
        position: {
            type: String,
        },
        animationEffect: {
            type: String,
        },
        sliderDuration: {
            type: Number,
        },
    },
    mediaItems: {
        type: {
            type: String,
            enum: ['image', 'video', 'streamingVideo'],
            required: true,
        },
        images:{
            type:Array
        }
    },
    password:{
        type: String,
    },
    url:{
        type:String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('SingleScreen', SingleScreenSchema);
