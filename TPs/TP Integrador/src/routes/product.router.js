import { Router } from "express";
import ProductManager from "../dao/Manager/product.manager.js";
import { productModel } from "../dao/Models/product.model.js";

const router = Router();

//const productManager = new ProductManager('./src/db/products.json');

router.get('/', async (req, res) => {
    let limit = parseInt(req.query.limit, 10) || 0;

    try {
        let products = await productModel.find();
        if (limit != 0)
            res.send({message: "Success", products: products.slice(0, limit)});
        else
            res.send({message: "Success", products: products});
    } catch (error) {
        res.send({ error: "Error al traer los productos" });
    }

    /* FS
    const products = await productManager.getProducts();

    if(limit != 0)
        res.send(products.slice(0, limit));
    else
        res.send(products);*/
});

router.get('/:pid', async (req, res) => {
    const {pid} = req.params;
    try {
        let product = await productModel.find({_id:pid});
        res.send({ result: product });
    } catch (error) {
        res.status(400).send({ error: "Error al buscar el producto con dicha ID" });
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

        
    try {
        let result = await productModel.create({
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        });

        res.send({ result: result });
    } catch (error) {
        res.send({ error: "Error al crear el producto" });
    }
    /* FS
    const respuesta = await productManager.addProduct(product);

    res.send(respuesta);*/

    const socketServer = req.app.get('socketio');
    socketServer.sockets.emit("refreshProduct");
});

router.put('/:pid', async (req, res) => {
    const id = req.params.pid;
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
        res.send({ result: "Producto actualizado correctamente" });
    } catch (error) {
        res.send({ error: "Error al actualizar el producto" });
    }

    /*FS
    const respuesta = await productManager.updateProduct(id,product);

    res.send(respuesta);*/

    const socketServer = req.app.get('socketio');
    socketServer.sockets.emit("refreshProduct");
});

router.delete('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid, 10);

    try {
        const result = await productModel.deleteOne({ _id: id });
        res.send({ message: "Producto eleminado correctamente" });
    } catch (error) {
        res.send({ error: "No se ha podido eliminar el producto" });
    }

    /*FS
    const respuesta = await productManager.deleteProduct(id);

    res.send(respuesta);*/

    const socketServer = req.app.get('socketio');
    socketServer.sockets.emit("refreshProduct");
});

export default router;