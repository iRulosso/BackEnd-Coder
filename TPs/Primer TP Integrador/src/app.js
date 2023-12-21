import express from 'express';
import productRouter from "./routes/product.router.js"
import cartRouter from "./routes/cart.router.js"
import mongoose from 'mongoose';
import {Server} from 'socket.io'

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const httpServer = app.listen(8080,()=>console.log("Servidor iniciado"));
const socketServer = new Server(httpServer);

const MONGO = "mongodb+srv://rschulmeister:Ramiro11221@ecomerce.uuy9zqa.mongodb.net/"
const connection = mongoose.connect(MONGO);

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
/*
socketServer.on('connection', async (socket)=>{
    console.log("NuevoCliente");

    const products = await productManager.getProducts();
    socketServer.emit('getProducts', products);

    socket.on('refreshProduct', async data=>
    {
        const products = await productManager.getProducts();
        socketServer.emit('getProducts', products);
    })
});*/