import { Router } from "express";
import userModel from "../dao/Models/user.model.js";

const router = Router();

router.post("/register", async (req, res) => {

    const { first_name, last_name, email, age, password,rol } = req.body;

    if(!rol)
        rol = "usuario";

    const exists = await userModel.findOne({ email });

    if (exists) {
        return res.status(400)
            .send({
                status: "error",
                error: "El usuario ya existe"
            })
    }

    const user = {
        first_name,
        last_name,
        email,
        age,
        password,
        rol
    }

    let result = await userModel.create(user);
    res.send({
        status: "success",
        message: "Usuario registrado"
    })
});

router.post("/login", async (req, res) => {

    const { email, password } = req.body;
    const user = await userModel.findOne({ email, password });

    if (!user) {
        return res.status(400).send({
            status: "error",
            error: "Datos incorrectos"
        })
    }

    req.session.user = {
        full_name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        rol: user.rol
    }

    res.send({
        status: "success",
        payload: req.session.user,
        message: "Mi primer Login!!"
    })

});

router.get("/logout", (req,res)=>
{
    req.session.destroy(err=>{
        if(err)
        {
            return res.status(500).send({
                status:"error",
                error: 'No se pudo desloguear'
            })
        }
        res.redirect("/login");
    });
})

export default router;