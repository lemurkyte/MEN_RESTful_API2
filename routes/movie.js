const router = require("express").Router();
const movie = require("../models/movie");

//create movie - post
router.post("/", (req, res) => {

    const data = req.body;
    movie.insertMany(data)
        .then(data => { res.status(201).send(data); })
        .catch(err => { res.status(500).send({ message: err.message }); });
});

router.get("/", (req, res) => {
    //advanced query by title
    const title = req.query.title;
 
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};
    movie.find(condition)
        .then(data => { res.send(data); })
        .catch(err => { res.status(500).send({ message: err.message }); });
});

//read all movies --get
router.get("/", (req, res) => {
    movie.find()
        .then(data => { res.send(data); })
        .catch(err => { res.status(500).send( { message: err.message }); })
});

//read all movies in stock --get
router.get("/instock", (req, res) => {
    movie.find({ inStock: true })
        .then(data => { res.send(data); })
        .catch(err => { res.status(500).send({ message: err }); })
});

//read specific movie --get
router.get("/:id", (req, res) => {

    movie.findById(req.params.id)
        .then(data => { res.send(data); })
        .catch(err => { res.status(500).send({ message: err.message }); });
});

// Update Movie
router.put("/:id", (req, res) => {
    //router.put("/:id", (req, res) => {
        const id = req.params.id;
    
        movie.findByIdAndUpdate(id, req.body)
            .then(data => {
                if (!data)
                    res.status(404).send({ message: "Cannot update movie with id=" + id + ". Maybemoviewas not found!" });
                else
                    res.send({ message: "movie was updated successfully." });
            })
            .catch(err => {
                res.status(500).send({ message: "Error updating movie with id=" + id });
            });
    
    });

//delete specific movie --delete
router.delete("/:id", (req, res) => {
    const id = req.params.id;

    movie.findByIdAndDelete(id)
    .then(data => {
        if (!data)
        {
            res.status(404).send({ message: "Cannot delete movie with id=" + id +".Maybe movie is not found!"})
        }
        else {
            res.send({ message: "Movie was successfully deleted"})
        }
    })
    .catch(err => { res.status(500).send( { message: "Error deleting movie with id=" + id }); }) 
})

module.exports = router;