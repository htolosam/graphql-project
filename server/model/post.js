const mongoose = require('mongoose');
const MSschema = mongoose.Schema;

const postSchema = MSschema({
    comment: String,
    userId: String,
});

module.exports = mongoose.model("Post", postSchema);