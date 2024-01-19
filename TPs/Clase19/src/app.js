import express from 'express';
import productRouter from "./routes/product.router.js"
import cartRouter from "./routes/cart.router.js"
import handlebars from 'express-handlebars'
import chatRouter from './routes/chat.router.js'
import __dirname from './utils.js';
import viewRouter from './routes/views.router.js'
import {Server} from 'socket.io'
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import sessionRouter from './routes/session.router.js';
import { productModel } from './dao/Models/product.model.js';
import { chatModel } from './dao/Models/chat.model.js';

const app = express();
const httpServer = app.listen(8080,()=>console.log("Servidor iniciado"));


const MONGO = "mongodb+srv://rschulmeister:Ramiro11221@ecomerce.uuy9zqa.mongodb.net/"
const connection = mongoose.connect(MONGO);

app.use(session({
    store: new MongoStore({
        mongoUrl: MONGO,
        ttl:3600
    }),
    secret:"CoderSecret",
    resave:false,
    saveUninitialized:false
}));

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
app.use('/api/session', sessionRouter);
app.use('/', viewRouter);