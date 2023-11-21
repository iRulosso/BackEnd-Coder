import express from 'express';
import ProductManager from './Manager/product.manager.js';

const app = express();
const productManager = new ProductManager('./src/db/products.json');

app.get('/products', async (req,res)=>{
    let limit = parseInt(req.query.limit, 10) || 0;
    const products = await productManager.getProducts();

    if(limit != 0)
        res.send(products.slice(0, limit));
    else
        res.send(products);
});

app.get('/products/:pid', async (req,res)=>{
    const id = parseInt(req.params.pid, 10);
    const product = await productManager.getProductById(id);

    if(product != 0)
        res.send(product);
    else
        res.send({error: `Producto no encontrado con ID: ${id}`})
});

app.listen(8888,()=>console.log("Servidor iniciado"));