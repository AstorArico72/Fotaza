const BCrypt = require ("bcrypt");
const JWT = require ("jsonwebtoken");
const {Usuarios, Sequelize} = require ("../models");
const Pug = require ("pug");
const Path = require ("path");
const Marked = require ("marked");
const SanitizeHTML = require ("sanitize-html");
var OtrasFunciones = require ("./OtrasFunciones.js");
const OpcionesSanitizado = {
    allowedTags: [
        "h1", "h2", "h3", "h4",
        "h5", "h6", "blockquote", "dd", "div",
        "dl", "dt", "hr", "li", "ol", "p", "pre",
        "ul", "a", "abbr", "b", "br", "code",
        "em", "i", "span", "strong", "table", "tbody", "td", "tfoot", "th", "thead", "tr", "img", "b", "strong",
        "video", "audio", "style"
      ],
    nonBooleanAttributes: [
        "class", "colspan", "rowspan", "cols", "rows", "alt", "type", "height", "width", "iframe", "src", "href", "title", "media"
    ],
    allowedSchemes: [ 'http', 'https', 'mailto', 'tel' ],
    allowedAttributes: {
        a: ["href", "title", "target"],
        img: [ 'src', 'alt', 'title', 'width', 'height'],
        iframe: ["src", "width", "height"],
        video: [ 'src', 'alt', 'title', 'width', 'height', "autoplay", "muted"],
        audio: [ 'src', 'alt', 'title', 'width', 'height', "autoplay", "muted"],
    },
    parseStyleAttributes: true,
    disallowedTagsMode: 'discard'
};

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

exports.Ingresar = (async (req, res, next) => {
    if (typeof req.user !== "undefined") {
        OnlineUser = req.user ["Usuario"];
        OnlineUserId = req.user ["ID_Usuario"];
        return res.redirect (301, "/");
    } else {
        res.sendFile ("Login.html", {root: Path.join (__dirname, "../Publico")});
    }
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
                "ID_Usuario": parseInt (FoundUser [0]["ID"]),
                "Rol_Usuario": FoundUser [0]["Rol"]
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
    let RolUsuario = req.body.RolUsuario;
    let PerfilUsuario = req.body.PerfilUsuario;

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
                Contraseña: NewPassword,
                Rol: RolUsuario,
                Perfil_Usuario: PerfilUsuario
            });
            res.redirect (301, "../");
        } catch (error) {
            OtrasFunciones.PaginaErrorPug (res, 500, "Error con la creación de la cuenta: <br>" + error);
            return;
        }
    }
});

exports.PerfilUsuario = (async (req, res, next) => {
    let Perfil;
    let OnlineUser;
    let OnlineUserId;

    if (typeof req.user !== "undefined") {
        OnlineUser = req.user ["Usuario"];
        OnlineUserId = req.user ["ID_Usuario"];
    } else {
        OnlineUser = "NIL";
        OnlineUserId = "NULL";
    }

    let FoundUser = await Usuarios.findAll ({
        attributes: [
            "ID",
            "Nombre_Usuario",
            "createdAt",
            "Rol",
            "Perfil_Usuario"
        ],
        where: {
            ID: req.params.ID
        }
    });

    if (FoundUser.length == 0) {
        OtrasFunciones.PaginaErrorPug (res, 404, "Ése usuario no existe.");
    } else {
        let NombreUsuario = FoundUser [0].Nombre_Usuario;
        let IdUsuarioEncontrado = FoundUser [0].ID;
        let FechaCreación = FoundUser [0].createdAt;
        let MarkdownSucio = Marked.parse (FoundUser [0].Perfil_Usuario);
        let DescripciónUsuario = SanitizeHTML (MarkdownSucio, OpcionesSanitizado);
        let RolUsuario = FoundUser [0].Rol;

        Perfil = Pug.renderFile ("./Views/PerfilUsuario.pug", {
            UsuarioConectado: OnlineUser,
            IdUsuarioConectado: OnlineUserId,
            UserName: NombreUsuario,
            JoinDate: FechaCreación,
            UserID: IdUsuarioEncontrado,
            UserProfile: DescripciónUsuario,
            UserRole: RolUsuario
        });
        res.send (Perfil);
    }
});

exports.EditUser = (async (req, res, next) => {
    let OnlineUser;
    let OnlineUserId;
    let Página;

    if (typeof req.user !== "undefined") {
        OnlineUser = req.user ["Usuario"];
        OnlineUserId = req.user ["ID_Usuario"];
    } else {
        OnlineUser = "NIL";
        OnlineUserId = "NULL";
    }

    let FoundUser = await Usuarios.findAll ({
        attributes: [
            "ID",
            "Nombre_Usuario",
            "createdAt",
            "Rol",
            "Perfil_Usuario"
        ],
        where: {
            ID: OnlineUserId
        }
    });

    if (OnlineUserId == "NULL") {
        OtrasFunciones.PaginaErrorPug (res, 401, "Función no permitida.");
    } else {
        let NombreUsuario = FoundUser [0].Nombre_Usuario;
        let DescripciónUsuario = FoundUser [0].Perfil_Usuario;
        Página = Pug.renderFile ("./Views/EditarUsuario.pug", {
            UsuarioConectado: OnlineUser,
            IdUsuarioConectado: OnlineUserId,
            UserName: NombreUsuario,
            UserProfile: DescripciónUsuario
        });
        res.send (Página);
    }
});

exports.SubirCambios = (async (req, res, next) => {
    let OnlineUserId;
    let IdUsuario = req.body.IdUsuario;

    if (typeof req.user !== "undefined") {
        OnlineUserId = req.user ["ID_Usuario"];
    } else {
        OnlineUserId = "NULL";
    }

    if (OnlineUserId == "NULL" || OnlineUserId != IdUsuario) {
        OtrasFunciones.PaginaErrorPug (res, 403, "Función no permitida.");
    }

    let PerfilViejo = await Usuarios.findAll ({
        attributes: [
            "Nombre_Usuario",
            "Perfil_Usuario"
        ],
        where: {
            ID: OnlineUserId
        }
    });
    let NombreViejo = PerfilViejo [0].Nombre_Usuario;
    let UserName = req.body.NombreUsuario;
    let PerfilUsuario = req.body.PerfilUsuario;

    let Duplicado = await Usuarios.findAll ({
        where: {
            Nombre_Usuario: UserName
        }
    });
    if (Duplicado.length > 0 && UserName != NombreViejo) {
        OtrasFunciones.PaginaErrorPug (res, 400, "Ése nombre de usuario ya existe, intenta otro.");
        return;
    } else {
        try {
            Usuarios.findByPk (IdUsuario).then (user=> {
                user.update ({
                    Nombre_Usuario: UserName,
                    Perfil_Usuario: PerfilUsuario
                });
            });
            res.redirect (301, "/Usuario/Salir");
        } catch (error) {
            OtrasFunciones.PaginaErrorPug (res, error.httpCode, "Error con los cambios: <br>" + error);
            return;
        }
    }
});

exports.CambiarClave = (async (req, res, next) => {
    let OnlineUser;
    let OnlineUserId;
    let IdUsuario = req.body.IdUsuario;
    let UserPassword = req.body.ContraseñaUsuario;

    //Ésto encripta la contraseña
    const salt = await BCrypt.genSalt(10);
    const NewPassword = await BCrypt.hash(UserPassword, salt);

    if (typeof req.user !== "undefined") {
        OnlineUser = req.user ["Usuario"];
        OnlineUserId = req.user ["ID_Usuario"];
    } else {
        OnlineUser = "NIL";
        OnlineUserId = "NULL";
    }

    if (OnlineUserId == "NULL" || OnlineUserId != IdUsuario) {
        OtrasFunciones.PaginaErrorPug (res, 403, "Función no permitida.");
    } else {
        try {
            Usuarios.findByPk (IdUsuario).then (usuario => {
                usuario.update ({
                    Contraseña: NewPassword
                });
            });
            res.redirect (301, "/Usuario/Salir");
        } catch (error) {
            OtrasFunciones.PaginaErrorPug (res, error.httpCode, "Error con los cambios: <br>" + error);
            return;
        }
    }
});

exports.EditPassword = (async (req, res, next) => {
    let OnlineUserId;
    let Página;

    if (typeof req.user !== "undefined") {
        OnlineUserId = req.user ["ID_Usuario"];
    } else {
        OnlineUserId = "NULL";
    }

    let FoundUser = await Usuarios.findAll ({
        attributes: [
            "ID",
            "Nombre_Usuario"
        ],
        where: {
            ID: OnlineUserId
        }
    });

    if (OnlineUserId == "NULL") {
        OtrasFunciones.PaginaErrorPug (res, 403, "Función no permitida.");
    } else {
        let NombreUsuario = FoundUser [0].Nombre_Usuario;
        Página = Pug.renderFile ("./Views/CambiarContraseña.pug", {
            IdUsuarioConectado: OnlineUserId,
            UserName: NombreUsuario
        });
        res.send (Página);
    }
});