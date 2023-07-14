const {Router} = require("express")
const CartsManager = require("../../managers/CartManager")
const path = require("path");//importo el modulo de fileSystemPath para pasar de una manera más facil la ruta donde voy a almacenar mis productos.
const filePath = path.join(__dirname, "..", "..", "data", "carts.json");

const cartsManager = new CartsManager(filePath)
const router = Router()

router.post("/", async (req, res) => {
    const {body} = req
    try{
        const cart = cartsManager.addCart(body)

        if (cart) {
            res.status(200).json({ status: 200, message: 'Cart added successfully', cart });
          } else {
            res.status(400).json({ status: 404, message: 'Failed to add the Cart' });
          }
        } catch (error) {
          res.status(500).json({status: 500, message: 'Error processing the request' });
        }
    }
)

router.get("/:cid", async (req, res) => {
    const id = req.params.cid

    try{
        const cart = await cartsManager.getCartById(+id)

        if(cart){
            res.status(200).json({ status: 200, cart });
        } else {
            res.status(404).json({ status: 404, message: `The Cart with ID: ${id} is not found. Please try again with a different ID` });
        }
    } catch (error) {
        console.log("Error retrieving the Cart", error);
        res.status(500).json({ status:500, message: 'Error retrieving the Cart' });
    }
})

router.post("/:cid/products/:pid", async (req, res) => {
    try{
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const result = await cartsManager.addProductToCart(cartId, productId)

    if(result === "Producto no encontrado"){
        res.status(404).send({status: 404, message: "Product not found"});
    } else if (result === "Carrito no encontrado") {
        res.status(404).send({status: 404, message: "Cart not found"})
    } else {
        res.status(200).send({status: 200, message: "Product added to cart"})
    } 
} catch (err) {
        console.error("Error adding product to cart", err)

        res.status(500).send({status: 500, message: "Ha ocurrido un erro al aregar el producto al carrito"})
    }
})

module.exports = router