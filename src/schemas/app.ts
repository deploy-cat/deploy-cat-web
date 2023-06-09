import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const appSchema = new Schema({
  name: String,
  image: String,
  host: String,
  user: String,
  port: Number,
  status: String,
}, {
  query: {
    byImage(image) {
      return this.where({ image });
    },
  },
});

const userSchema = new Schema({
  name: String,
  role: String,
}, {
  query: {
    byImage(image) {
      return this.where({ image });
    },
  },
});

export const AppStore = model('App', appSchema);
