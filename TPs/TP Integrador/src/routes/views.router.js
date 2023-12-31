import express from "express";
import ProductManager from "../dao/Manager/product.manager.js";
const productManager = new ProductManager('./src/db/products.json');
const router = express.Router();

router.get('/', async (req, res)=>
{
    const products = await productManager.getProducts();
    res.render('home', {
        products,
        style: 'home.css'
    });
});

router.get('/realtimeproducts', async (req, res)=>
{
    res.render('realTimeProducts', {});
});
router.get('/chat', async (req, res)=>
{
    res.render('chat', {});
});

export default router;