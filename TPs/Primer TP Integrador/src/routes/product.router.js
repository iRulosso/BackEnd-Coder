import { Router } from "express";
import ProductManager from "../Manager/product.manager.js";
import { productModel } from "../Models/product.model.js";

const router = Router();

const productManager = new ProductManager('./src/db/products.json');

router.get('/', async (req, res) => {
    try {
        let products = await productModel.find();
        red.send({ result: "Success", payload: products });
    } catch (error) {
        console.log("Error al traer los productos")
    }

    /* FS
    let limit = parseInt(req.query.limit, 10) || 0;
    const products = await productManager.getProducts();

    if(limit != 0)
        res.send(products.slice(0, limit));
    else
        res.send(products);*/
});

router.get('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid, 10);

    try {
        let product = await productModel.find({ _id: id });
        red.send({ result: product });
    } catch (error) {
        console.log("Error al traer el producto con esa id")
    }

    /*FS
    const product = await productManager.getProductById(id);

    if(product != 0)
        res.send(product);
    else
        res.send({error: `Producto no encontrado con ID: ${id}`})*/
});

router.post('/', async (req, res) => {
    const { title, description, price, thumbnail, stock, code } = req.body;

    if (!title || !description || !price || !thumbnail || !stock || !code)
        return res.send({ error: `No se han proporcionado todos los campos` });

    const product = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock
    }

    try {
        const result = await productModel.create(product);
        red.send({ result: "Producto añadir correctamente" });
    } catch (error) {
        console.log("Error al crear el producto")
    }


    /* FS
    const respuesta = await productManager.addProduct(product);

    res.send(respuesta);*/
});

router.put('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid, 10);
    const { title, description, price, thumbnail, stock, code } = req.body;

    if (!title || !description || !price || !thumbnail || !stock || !code)
        return res.send({ error: `No se han proporcionado todos los campos` });

    const newProduct = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock
    }

    try {
        const result = await productModel.updateOne({_id:id},{$set:newProduct});
        red.send({ result: "Producto actualizado correctamente" });
    } catch (error) {
        console.log("Error al actualizar el producto")
    }

    /*FS
    const respuesta = await productManager.updateProduct(id,product);

    res.send(respuesta);*/
});

router.delete('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid, 10);

    try {
        const result = await productModel.deleteOne({ _id: id });
        res.send({ message: "Producto eleminado correctamente" });
    } catch (error) {
        console.log("Error al eliminar el producto")
    }

    /*FS
    const respuesta = await productManager.deleteProduct(id);

    res.send(respuesta);*/
});

export default router;