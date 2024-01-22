import { Router } from "express";
import userModel from "../dao/Models/user.model.js";
import { createHash, validatePassword } from "../utils.js";
import passport from "passport";

const router = Router();

router.post("/register", passport.authenticate("register", {failureRedirect:"/api/session/failregister"}),
async(req,res)=>{res.send({status:"success",message:"User registrado"})});

router.get("/failregister", async(req,res)=>
{
    console.log("Fallo el registro");
    res.send({error:"Fallo en el registro"});
})

router.post("/login", passport.authenticate("login", {failureRedirect:'/api/session/failloing'}),
async(req,res)=>
{
    if(!req.user)return res.status(400).send({status:'error'});
    req.session.user = {
        full_name: `${req.user.first_name} ${req.user.last_name}`,
        email: req.user.email,
        age: req.user.age,
        rol: req.user.rol
    }
    res.send({status:'success',payload:req.user});
});

router.get('/github', passport.authenticate('github', {scope:['user:email']}), async(req,res)=>{});

router.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/login'}), async(req,res)=>{
    req.session.user = req.user;
    res.redirect('/products');
});

router.get("/faillogin", (req,res)=>
{
    res.send({error:"Fail login"})
})

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

router.post("/restartpassword", async(req,res)=>
{
    const {email,password} = req.body;
    console.log(email + password);
    if(!email || !password) return res.status(400).send({status:"error", message:"Datos incorrectos"});

    const user = await userModel.findOne({email});
    if(!user) return res.status(400).send({status:"error", message:"No existe el usuario"});

    const newHashPassword = createHash(password);

    await userModel.updateOne({_id:user._id}, {$set:{password:newHashPassword}});
    res.status(200).send({status:"success", message:"Contraseña restaurada"});
})
export default router;