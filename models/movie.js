const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let movieSchema = new Schema(
    {
        title: { type: String, required: true, minlength: 4, maxlength: 50 },
        genre: { type: String, required: true },
        storyline: { type: String, required: true, minlength: 4 },
        rate: { type: Number, required: true },
        year: { type: Number, required: true }
    }
);

module.exports = mongoose.model("movie", movieSchema);
