/* eslint-disable no-underscore-dangle */
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGOOSE_URI;
console.log("connecting to ", url);

mongoose
  .connect(url)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("error connecting to MongoDB ", error.message));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, "User name required"],
  },
  number: {
    type: String,
    minLength: 8,
    required: [true, "User phone number required"],
    validate: {
      validator(value) {
        if (value.split("-")[0].length > 3) return false;

        return /\d{2,3}-\d/.test(value);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});

personSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
