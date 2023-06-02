import * as mongoose from "mongoose";

export const clientSchema = new mongoose.Schema({

    email: {
        type: String,

    },
    username: {
        type: String,
    },

    status: {
        type: String,
        default: "offline"
    },
    lastseen: {

    }
},
    { timestamps: true }
);