const router = require("express").Router();
const product = require("../models/product");

//create product - post
router.post("/", (req, res) => {

    const data = req.body;
    product.insertMany(data)
        .then(data => { res.status(201).send(data); })
        .catch(err => { res.status(500).send({ message: err.message }); });
});

router.get("/", (req, res) => {
    //advanced query by name
    const name = req.query.name;
 
    var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};
    product.find(condition)
        .then(data => { res.send(data); })
        .catch(err => { res.status(500).send({ message: err.message }); });
});

//read all products --get
router.get("/", (req, res) => {
    product.find()
        .then(data => { res.send(data); })
        .catch(err => { res.status(500).send( { message: err.message }); })
});

//read all products in stock --get
router.get("/instock", (req, res) => {
    product.find({ inStock: true })
        .then(data => { res.send(data); })
        .catch(err => { res.status(500).send({ message: err }); })
});

//read specific product --get
router.get("/:id", (req, res) => {

    product.findById(req.params.id)
        .then(data => { res.send(data); })
        .catch(err => { res.status(500).send({ message: err.message }); });
});

// Update Product
router.put("/:id", (req, res) => {
    //router.put("/:id", (req, res) => {
        const id = req.params.id;
    
        product.findByIdAndUpdate(id, req.body)
            .then(data => {
                if (!data)
                    res.status(404).send({ message: "Cannot update product with id=" + id + ". Maybe product was not found!" });
                else
                    res.send({ message: "Product was updated successfully." });
            })
            .catch(err => {
                res.status(500).send({ message: "Error updating Product with id=" + id });
            });
    
    });

//delete specific product --delete
router.delete("/:id", (req, res) => {
    const id = req.params.id;

    product.findByIdAndDelete(id)
    .then(data => {
        if (!data)
        {
            res.status(404).send({ message: "Cannot delete product with id=" + id +".Maybe product is not found!"})
        }
        else {
            res.send({ message: "Product was successfully deleted"})
        }
    })
    .catch(err => { res.status(500).send( { message: "Error deleting product with id=" + id }); }) 
})

module.exports = router;