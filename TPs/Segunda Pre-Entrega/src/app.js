import express from 'express';
import productRouter from "./routes/product.router.js"
import cartRouter from "./routes/cart.router.js"
import handlebars from 'express-handlebars'
import chatRouter from './routes/chat.router.js'
import __dirname from './utils.js';
import viewRouter from './routes/views.router.js'
import {Server} from 'socket.io'
import mongoose from 'mongoose';
import { productModel } from './dao/Models/product.model.js';
import { chatModel } from './dao/Models/chat.model.js';

const app = express();
const httpServer = app.listen(8080,()=>console.log("Servidor iniciado"));

const socketServer = new Server(httpServer);
app.set('socketio', socketServer);

app.engine('handlebars', handlebars.engine({runtimeOptions:{allowProtoPropertiesByDefault:true,allowedProtoMethodsByDefault:true}}));
app.set('views', __dirname+'/views')
app.set('view engine','handlebars');

app.use(express.static(__dirname+'/public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/chat', chatRouter);
app.use('/', viewRouter);

const MONGO = "mongodb+srv://rschulmeister:Ramiro11221@ecomerce.uuy9zqa.mongodb.net/"
const connection = mongoose.connect(MONGO);

socketServer.on('connection', async (socket)=>{
    console.log("NuevoCliente");

    const products = await productModel.find();
    socketServer.emit('getProducts', products);
    const chats = await chatModel.find();
    socketServer.emit('getChats', chats);

    socket.on('refreshProduct', async data=>
    {
        const products = await productModel.find();
        socketServer.emit('getProducts', products);
    })
    socket.on('refreshChat', async data=>
    {
        console.log("Nuevo mensaje");
        const chats = await chatModel.find();
        socketServer.emit('getChats', chats);
    })
});