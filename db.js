const mongoose = require('mongoose')
Schema = mongoose.Schema

const userSchema = new Schema({
    username: {type: String, default: '', trim: true},
    password: {type: String, default: '', trim: true},
    nickname: {type: String, default: '', trim: true},
    email: {type: String, default: '', trim: true},
    phone: {type: String, default: '', trim: true},
    gender: {type: String, default: '', trim: true},
    type: {type: String, default: '', trim: true}
});

const favoriteSchema = new Schema({
  username: { type: String, default: '', trim: true },
  name: {type: String, default: '', trim: true},
  image: {type: String, default: '', trim: true},
  price: {type: String, default: '', trim: true},
})

const goodSchema = new Schema({
    name: {type: String, default: '', trim: true},
    image: {type: String, default: '', trim: true},
    price: {type: String, default: '', trim: true},
})

const orderSchema = new Schema({
  username: { type: String, default: '', trim: true },
  name: {type: String, default: '', trim: true},
  image: {type: String, default: '', trim: true},
  price: {type: String, default: '', trim: true},
})

const cartSchema = new Schema({
  username: { type: String, default: '', trim: true },
  name: {type: String, default: '', trim: true},
  image: {type: String, default: '', trim: true},
  price: {type: String, default: '', trim: true},
})

const commentSchema = new Schema({
  username: { type: String, default: '', trim: true },
  name: {type: String, default: '', trim: true},
  comment: {type: String, default: '', trim: true},
})

module.exports = { userSchema, goodSchema, favoriteSchema, orderSchema, cartSchema, commentSchema }





