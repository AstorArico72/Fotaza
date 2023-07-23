const Express = require ("express");
const OtrasRutas = require("./Rutas/RutasMiscelaneas.js");
const APP = Express ();
const RutasUsuario = require ("./Rutas/Usuario.js");
const RutasSubidas = require ("./Rutas/Posts.js");
const CookieParser = require ("cookie-parser");
const path = require ("path");

APP.set ("view engine", "pug");
APP.set ("views", path.join (__dirname, "/Views"));
APP.use (CookieParser ());
APP.use (Express.urlencoded ());
APP.use ("/CSS", Express.static (__dirname + "/Publico/Sketchy-Bootswatch.css"));
APP.use ('/favicon', Express.static (__dirname + "/Publico/expressjs_logo_icon_169185.ico"));
APP.use ('/Home', Express.static (__dirname + "/Publico/Home.html"));

//Parece que no puedo manejar los archivos estáticos desde el controlador correspondiente.
APP.use ('/Usuario/Ingresar', Express.static (__dirname + "/Publico/Login.html"));
APP.use ('/Usuario/Nuevo', Express.static (__dirname + "/Publico/NuevoUsuario.html"));
APP.use ("/Posts", RutasSubidas);
APP.use ("/Usuario", RutasUsuario);
APP.use (OtrasRutas);

APP.listen (8001, ()=> {
    console.log ("Servidor iniciado en puerto 8001.");
});