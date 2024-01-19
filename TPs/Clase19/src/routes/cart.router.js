import { Router } from "express";
import CartManager from "../dao/Manager/cart.manager.js";
import { cartModel } from "../dao/Models/cart.model.js";

const router = Router();

const cartManager = new CartManager('./src/db/carts.json');

router.get('/:cid', async (req,res)=>{///
    const id = req.params.cid;

    try {
        let cart = await cartModel.find({_id:id});
        res.send({ result: cart });
    } catch (error) {
        res.status(400).send({ error: "Error al buscar el carrito con dicha ID" });
    }

    /*FS
    const cart = await cartManager.getCartById(id);

    if(cart != 0)
        res.send(cart);
    else
        res.send({error: `No existe un carrito con ID: ${id}`})*/
});

router.post('/', async (req,res)=>{///
    const cart = req.body;

    const { products } = req.body;

    if (!products)
        return res.send({ error: `No se han proporcionado ningun producto` });
   
    try {
        let result = await cartModel.create({
            products
        });

        res.send({ result: result });
    } catch (error) {
        res.send({ error: "Error al crear el carrito" });
    }

    /*
    const respuesta = await cartManager.addCart(cart);

    res.send(respuesta);*/
});
router.post('/:cid/product/:pid', async (req,res)=>{///
    const {cid, pid} = req.params;

    try {
        const result = await cartModel.updateOne({_id:cid},{$push:{ products: {product: pid, quantity: 1}}});
        res.send({ result: "Carrito actualizado correctamente" });
    } catch (error) {
        res.send({ error: "Error al actualizar el carrito", result });
    }

    /*
    const respuesta = await cartManager.addProductToCart(cid, pid);
    res.send(respuesta);*/
});

router.delete('/:cid/products/:pid', async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    try {
        const result = await cartModel.updateOne(
            {_id:cid},
            { $pull: { products: { product: pid } } }
          );
        res.send({ message: "Producto eleminado correctamente del carrito" });
    } catch (error) {
        res.send({ error: "No se ha podido eliminar el producto del carrito" });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    const { cantidad } = req.body;

    if (!cantidad)
        return res.send({ error: `Body mal formado` });

    try {
        const result = await cartModel.updateOne(
            { _id: cid, 'products.id': pid },
            { $set: { 'products.$.quantity': cantidad } }
          );
        res.send({ result: "Producto actualizado correctamente" });
    } catch (error) {
        res.send({ error: "Error al actualizar el producto" });
    }
});

router.delete('/:cid', async (req, res) => {
    const cid = req.params.cid;

    try {
        const result = await cartModel.updateOne(
            { _id: cid },
            { $unset: { products: 1 } }
          );
        res.send({ message: "Productos eleminados correctamente del carrito" });
    } catch (error) {
        res.send({ error: "No se ha podido eliminar los productos del carrito" });
    }
});

export default router;