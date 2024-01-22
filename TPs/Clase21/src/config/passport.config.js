import passport from 'passport';
import local from 'passport-local';
import userModel from '../dao/Models/user.model.js';
import { createHash, validatePassword } from '../utils.js';
import GitHubStrategy from 'passport-github2';

const LocalStrategy = local.Strategy;

const inicializatePassport = () => {
    passport.use("register", new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, username, password, done) => {
            let { first_name, last_name, email, age, rol } = req.body;
            if (!rol) rol = "usuario";

            try {
                let user = await userModel.findOne({ email: username });
                if (user) {
                    console.log("Usuario ya registrado");
                    return done(null, false);
                }

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    rol
                }
                const result = await userModel.create(newUser);
                return done(null, result);
            } catch (error) {
                return done(error);
            }
        }));

    passport.use("login", new LocalStrategy({usernameField:"email"},
    async(username, password, done)=>{
        try {
            const user = await userModel.findOne({email:username});
            if(!user)return done(null, false);
            if(!validatePassword(password,user)) return done(null,false);

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done)=>
    {
        done(null, user._id);
    });

    passport.deserializeUser(async(id, done)=>
    {
        let user = await userModel.findById(id);
        done(null,user);
    });

    passport.use('github', new GitHubStrategy({
        clientID:"Iv1.5867552fc53b744d",
        clientSecret:"c63c4bb59b5cd4d7c060308de055da00b216d359",
        callbackURL:"http://localhost:8080/api/session/githubcallback"
    }, async(accesToken, refreshToken, profile, done)=>{
        try {
            console.log(profile);
            const first_name = profile._json.name;
            let email;
            if(!profile._json.email)
            {
                email = profile.username
            }

            let user = await userModel.findOne({ email: email });
                if (user) {
                    console.log("Usuario ya registrado");
                    return done(null, false);
                }

                const newUser = {
                    first_name,
                    last_name:"",
                    email,
                    age:18,
                    password: "",
                    rol:"usuario"
                }
                const result = await userModel.create(newUser);
                return done(null, result);
        } catch (error) {
            return done(error);
        }
    }));
}

export default inicializatePassport;