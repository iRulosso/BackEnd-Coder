import express from 'express';
import productRouter from "./routes/product.router.js"
import cartRouter from "./routes/cart.router.js"
import handlebars from 'express-handlebars'
import __dirname from './utils.js';
import viewRouter from './routes/views.router.js'
import {Server} from 'socket.io'
import mongoose from 'mongoose';
import ProductManager from "./dao/Manager/product.manager.js";

const productManager = new ProductManager('./src/db/products.json');

const app = express();
const httpServer = app.listen(8080,()=>console.log("Servidor iniciado"));

const socketServer = new Server(httpServer);
app.set('socketio', socketServer);

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views')
app.set('view engine','handlebars');

app.use(express.static(__dirname+'/public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewRouter);

const MONGO = "mongodb+srv://rschulmeister:Ramiro11221@ecomerce.uuy9zqa.mongodb.net/"
const connection = mongoose.connect(MONGO);

socketServer.on('connection', async (socket)=>{
    console.log("NuevoCliente");

    const products = await productManager.getProducts();
    socketServer.emit('getProducts', products);

    socket.on('refreshProduct', async data=>
    {
        const products = await productManager.getProducts();
        socketServer.emit('getProducts', products);
    })
});