const BCrypt = require ("bcrypt");
const JWT = require ("jsonwebtoken");
const {Usuarios} = require ("../models");
const Pug = require ("pug");

exports.Autenticador = async (req, res, next) => {
    let TokenAcceso = req.cookies ["AccesoFotaza"];
    if (!TokenAcceso) {
        let ErrorPug = Pug.renderFile ("./Views/MensajeError.pug", {
            NoError: "401",
            MensajeError: "No está autenticado. <a href='./Ingresar'>¿Ingresar?</a>"
        });
        res.status (401).send (ErrorPug);
    } else {
        try {
            const decoded = JWT.verify(TokenAcceso, "Ésto no es Instagram");
            req.user = decoded;
        } catch (err) {
            let ErrorPug = Pug.renderFile ("./Views/MensajeError.pug", {
                NoError: "500",
                MensajeError: "Error del servidor con la autenticación. <a href='./Ingresar'>¿Ingresar de nuevo?</a>"
            });
            res.status (500).send (ErrorPug);
        }
    }
    next ();
};

const CookieOptions = {
    path:"/",
    sameSite:true,
    maxAge: 1000 * 60 * 60,
    httpOnly: true
}

exports.LogOut = (async (req, res, next)=> {
    res.clearCookie ("AccesoFotaza", {
        path: "/"
    });
    res.redirect ("..");
    return next ();
});

exports.LogIn = (async (req, res, next) => {
    //Éstos datos vienen del formulario que llama a ésta función
    let UserName = req.body.NombreUsuario;
    let UserPassword = req.body.ContraseñaUsuario;

    let FoundUser = await Usuarios.findAll ({
        where: {
            Nombre_Usuario: UserName
        }
    });

    if (FoundUser.length == 0){
        let ErrorPug = Pug.renderFile ("./Views/MensajeError.pug", {
            NoError: "401",
            MensajeError: "Usuario o contraseña incorrectos. <a href='./Ingresar'>¿Ingresar de nuevo?</a>"
        });
        res.status (401).send (ErrorPug);
    } else {
        if (await BCrypt.compare (UserPassword, FoundUser [0]["Contraseña"]) == true) {
            //Ésto genera el token
            const Token = JWT.sign ({
                //Paso la contraseña encriptada en el token junto con el nombre de usuario
                "Usuario": UserName,
                "Contraseña": UserPassword,
                "ID_Usuario": FoundUser [0]["ID"]
            }, "Ésto no es Instagram", { //Necesito otra forma de manejar los "secretos" 
                expiresIn: "1h"
            });
    
            res.cookie ("AccesoFotaza", Token, CookieOptions);
            res.redirect ("/Posts");
        } else {
            let ErrorPug = Pug.renderFile ("./Views/MensajeError.pug", {
                NoError: "401",
                MensajeError: "Usuario o contraseña incorrectos. <a href='./Ingresar'>¿Ingresar de nuevo?</a>"
            });
            res.status (401).send (ErrorPug);
        }
    }
});

exports.NewUser = (async (req, res, next) => {
    //Éstos datos vienen del formulario que llama a ésta función
    let UserName = req.body.NombreUsuario;
    let UserPassword = req.body.ContraseñaUsuario;

    //Ésto encripta la contraseña
    const salt = await BCrypt.genSalt(10);
    const NewPassword = await BCrypt.hash(UserPassword, salt);
    try {
        Usuarios.create ({
            Nombre_Usuario: UserName,
            Contraseña: NewPassword
        });
        res.redirect (301, "../");
    } catch (error) {
        let ErrorPug = Pug.renderFile ("./Views/MensajeError.pug", {
            NoError: "500",
            MensajeError: "Error con la creación de la cuenta: <br>" + error
        });
        res.status (500).send (ErrorPug);
    }
});