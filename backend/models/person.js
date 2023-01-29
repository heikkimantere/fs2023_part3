const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to", url);
mongoose
  .connect(url)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  number: {
    type: String,
    validate: [
      {
        validator: function (v) {
          return /^(\d{2,3}-\d{1,})$/.test(v);
        },
        message: () => "Allowed formats are 12-345678 and 123-45678",
      },
      {
        validator: function (v) {
          // requires 8 digits, so length musth be at least 9
          return v.length > 8;
        },
        message: () => "must have at least 8 digits",
      },
    ],
    required: [true, "User phone number required"],
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
