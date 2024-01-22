import { Router } from "express";
import { chatModel } from "../dao/Models/chat.model.js";

const router = Router();


router.get('/', async (req,res)=>{///

});

router.post('/', async (req,res)=>{///
    const chat = req.body;

    try {
        let result = await chatModel.create(chat);
        const socketServer = req.app.get('socketio');
        socketServer.sockets.emit("refreshChat");
        res.send({ result: result });
    } catch (error) {
        res.send({ error: "Error al enviar el mensaje" });
    }
});

export default router;