import { Router } from "express";
import CartManager from "../Manager/cart.manager.js";

const router = Router();

const cartManager = new CartManager('./src/db/carts.json');

router.get('/:cid', async (req,res)=>{///
    const id = parseInt(req.params.cid, 10);
    const cart = await cartManager.getCartById(id);

    if(cart != 0)
        res.send(cart);
    else
        res.send({error: `No existe un carrito con ID: ${id}`})
});

router.post('/', async (req,res)=>{///
    const cart = req.body;
    const respuesta = await cartManager.addCart(cart);

    res.send(respuesta);
});
router.post('/:cid/product/:pid', async (req,res)=>{///
    const {cid, pid} = req.params;
    const respuesta = await cartManager.addProductToCart(cid, pid);
    res.send(respuesta);
});

export default router;