import express from "express";
import ProductManager from "../dao/Manager/product.manager.js";
const productManager = new ProductManager('./src/db/products.json');
const router = express.Router();
import { productModel } from "../dao/Models/product.model.js";
import { cartModel } from "../dao/Models/cart.model.js";

const publicAccess = (req,res,next)=>
{
    if(req.session.user)
    {
        return res.redirect('/products');
    }
    next();
}

const privateAccess = (req,res,next)=>
{
    if(!req.session.user)
    {
        return res.redirect('/login');
    }
    next();
}

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
router.get('/products', privateAccess, async (req, res)=>
{
    let limit = parseInt(req.query.limit,10) || 10;
    let page = parseInt(req.query.page,10) || 1;
    let query = req.query.query || "";
    let sort = req.query.sort || "";

    try {
        let products = await productModel.paginate({}, {limit:limit, page:page});

        let obj = 
        {
            products,
            session: req.session.user
        }

        res.render('products', {obj});
        
    } catch (error) {
        res.send({ error: "Error al traer los productos" });
    }
});

router.get('/carts/:cid', async (req, res)=>
{
    let cid = req.params.cid;

    try {
        let cart = await cartModel.findOne({ _id:cid });
        if (cart) {
            const products = cart.products;
            res.render('cart', {products});
          } else {
            res.send({ error: "Error al traer el carrito." });
          }
        
    } catch (error) {
        res.send({ error: "Error al traer el carrito" });
    }
});

router.get('/register', publicAccess,  (req, res)=>{
    res.render('register');
});
router.get('/login', publicAccess, (req, res)=>{
    res.render('login');
});

export default router;