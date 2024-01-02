import express from "express";
import ProductManager from "../dao/Manager/product.manager.js";
const productManager = new ProductManager('./src/db/products.json');
const router = express.Router();
import { productModel } from "../dao/Models/product.model.js";

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
router.get('/products', async (req, res)=>
{
    let limit = parseInt(req.query.limit,10) || 10;
    let page = parseInt(req.query.page,10) || 1;
    let query = req.query.query || "";
    let sort = req.query.sort || "";

    try {
        let products = await productModel.paginate({}, {limit:limit, page:page});

        res.render('products', {products});
        
    } catch (error) {
        res.send({ error: "Error al traer los productos" });
    }
});

export default router;