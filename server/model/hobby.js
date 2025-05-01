const mongoose = require('mongoose');
const MSschema = mongoose.Schema;

const hobbySchema = MSschema({
    title: String,
    description: String,
    userId: String,
});

module.exports = mongoose.model("Hobby", hobbySchema);