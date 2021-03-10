const router = require("express").Router();
const product = require("../models/product");

//create product - post
router.post("/", (req, res) => {

    data = req.body;
    
    product.insertMany(data) 
    .then(data => { res.send(data); })
    .catch(err => { res.status(500).send( { message: err.message }); })
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
    .catch(err => { res.status(500).send( { message: err.message }); })
});

//read specific product --get
router.get("/:id", (req, res) => {

    product.findById(req.params.id)
    .then(data => { res.send(data); })
    .catch(err => { res.status(500).send( { message: err.message }); })
});

//update specific product --put
router.put("/:id", (req, res) => {
    const id = req.params.id;

    product.findByIdAndUpdate(id, req.body)
    .then(data => {
        if (!data)
        {
            res.status(404).send({ message: "Cannot update product with id=" + id +".Maybe product is not found!"})
        }
        else {
            res.send({ message: "Product was successfully updated"})
        }
    })
    .catch(err => { res.status(500).send( { message: "Error updating   product with id=" + id }); }) 
})

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