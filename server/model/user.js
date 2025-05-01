const mongoose = require('mongoose');
const MSschema = mongoose.Schema;

const userSchema = MSschema({
    name: String,
    age: Number,
    profession: String
});

module.exports = mongoose.model("User", userSchema);