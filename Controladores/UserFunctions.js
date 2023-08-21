const BCrypt = require ("bcrypt");
const JWT = require ("jsonwebtoken");
const {Usuarios} = require ("../models");
var OtrasFunciones = require ("./OtrasFunciones.js");

exports.Autenticador = async (req, res, next) => {
    let TokenAcceso = req.cookies ["AccesoFotaza"];
    if (!TokenAcceso) {
        req.user = undefined;
    } else {
        try {
            const decoded = JWT.verify(TokenAcceso, "Ésto no es Instagram");
            req.user = decoded;
        } catch (err) {
            OtrasFunciones.PaginaErrorPug (res, 500, "Error del servidor con la autenticación. <a href='./Ingresar'>¿Ingresar de nuevo?</a>");
            return;
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
        OtrasFunciones.PaginaErrorPug (res, 401, "Usuario o contraseña incorrectos. <a href='./Ingresar'>¿Ingresar de nuevo?</a>");
        return;
    } else {
        if (await BCrypt.compare (UserPassword, FoundUser [0]["Contraseña"]) == true) {
            //Ésto genera el token
            const Token = JWT.sign ({
                "Usuario": UserName,
                "Contraseña": UserPassword,
                "ID_Usuario": parseInt (FoundUser [0]["ID"])
            }, "Ésto no es Instagram", { //Necesito otra forma de manejar los "secretos" 
                expiresIn: "1h"
            });
    
            res.cookie ("AccesoFotaza", Token, CookieOptions);
            res.redirect ("/Posts");
        } else {
            OtrasFunciones.PaginaErrorPug (res, 401, "Usuario o contraseña incorrectos. <a href='./Ingresar'>¿Ingresar de nuevo?</a>");
            return;
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
    let Duplicado = await Usuarios.findAll ({
        where: {
            Nombre_Usuario: UserName
        }
    });
    if (Duplicado.length > 0) {
        OtrasFunciones.PaginaErrorPug (res, 400, "Ése nombre de usuario ya existe, intenta otro.");
        return;
    } else {
        try {
            Usuarios.create ({
                Nombre_Usuario: UserName,
                Contraseña: NewPassword
            });
            res.redirect (301, "../");
        } catch (error) {
            OtrasFunciones.PaginaErrorPug (res, 500, "Error con la creación de la cuenta: <br>" + error);
            return;
        }
    }
});