const Express = require ("express");
const OtrasRutas = require("./Rutas/RutasMiscelaneas.js");
const APP = Express ();
const RutasUsuario = require ("./Rutas/Usuario.js");
const RutasSubidas = require ("./Rutas/Posts.js");
const RutasComentarios = require ("./Rutas/Comentarios.js");
const CookieParser = require ("cookie-parser");
const BodyParser = require ("body-parser");
const path = require ("path");

const OpcionesArchivo = {
    dotfiles: "ignore",
    extensions: ["jpeg", "jpg", "bmp", "png", "svg"],
    mime: ["image/jpeg", "image/bmp", "image/png", "image/svg"]
}
const OpcionesDoc = {
    dotfiles: "ignore",
    extensions: ["jpeg", "jpg", "bmp", "png", "svg", "html"]
}

APP.set ("view engine", "pug");
APP.set ("views", path.join (__dirname, "/Views"));
APP.use (CookieParser ());
APP.use (BodyParser.urlencoded ({
    extended: true
}));
APP.use (Express.urlencoded ());
APP.use ("/Medios", Express.static ("Medios", OpcionesArchivo));
APP.use ("/Documentos", Express.static ("Documentos", OpcionesDoc));
APP.use ("/CSS", Express.static (__dirname + "/Publico/Sketchy-Bootswatch.css"));
APP.use ("/Estrellas", Express.static (__dirname + "/Publico/CSS-estrellas.css"));
APP.use ('/favicon', Express.static (__dirname + "/Publico/expressjs_logo_icon_169185.ico"));
//Parece que no puedo manejar los archivos estáticos desde el controlador correspondiente.
APP.use ('/Usuario/Ingresar', Express.static (__dirname + "/Publico/Login.html"));
APP.use ('/Usuario/Nuevo', Express.static (__dirname + "/Publico/NuevoUsuario.html"));
APP.use ("/Posts", RutasSubidas);
APP.use ("/Usuario", RutasUsuario);
APP.use ("/Comentarios", RutasComentarios);
APP.use (OtrasRutas);

APP.listen (8001, ()=> {
    console.log ("Servidor iniciado en puerto 8001.");
});

exports.OpcionesArchivo = OpcionesArchivo;