import { Router } from "express";
import ProductManager from "../Manager/product.manager.js";

const router = Router();

const productManager = new ProductManager('./src/db/products.json');

router.get('/', async (req,res)=>{
    let limit = parseInt(req.query.limit, 10) || 0;
    const products = await productManager.getProducts();

    if(limit != 0)
        res.send(products.slice(0, limit));
    else
        res.send(products);
});

router.get('/:pid', async (req,res)=>{
    const id = parseInt(req.params.pid, 10);
    const product = await productManager.getProductById(id);

    if(product != 0)
        res.send(product);
    else
        res.send({error: `Producto no encontrado con ID: ${id}`})
});

router.post('/', async (req,res)=>{
    const product = req.body;
    const respuesta = await productManager.addProduct(product);

    res.send(respuesta);
});

router.put('/:pid', async (req,res)=>{
    const id = parseInt(req.params.pid, 10);
    const product = req.body;
    const respuesta = await productManager.updateProduct(id,product);

    res.send(respuesta);
});

router.delete('/:pid', async (req,res)=>{
    const id = parseInt(req.params.pid, 10);
    const respuesta = await productManager.deleteProduct(id);

    res.send(respuesta);
});

export default router;