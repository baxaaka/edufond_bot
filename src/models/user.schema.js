const { Schema, model } = require("mongoose")

const userSchema = new Schema({
    full_name: {
        type: String
    },
    username: {
        type: String,

    },
    telegram_id: {
        type: Number,
        unique: true,
    },
    phone_number: {
        type: String,
        unique: true,

    }
})

const User = model("User", userSchema)

module.exports = { User }