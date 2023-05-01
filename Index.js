const Express = require ("express");
const OtrasRutas = require("./Rutas/RutasMiscelaneas.js");
const APP = Express ();
//Pendiente.
// const RutasFotaza = require ("./Rutas/Fotaza.js");
const CookieParser = require ("cookie-parser");

const SaludadorConsola = (req, _res, next) => {
    console.log ("Llegó pedido para " + req.url);
    next ();
};

APP.set ("view engine", "pug");
APP.use (SaludadorConsola);
APP.use (CookieParser ());
APP.use (Express.urlencoded ());
APP.use ("/CSS", Express.static (__dirname + "/Publico/Sketchy-Bootswatch.css"));
APP.use ('/favicon', Express.static (__dirname + "/Publico/expressjs_logo_icon_169185.ico"));
APP.use ('/Home', Express.static (__dirname + "/Publico/Home.html"));
// APP.use ("/Fotaza", RutasFotaza);
APP.use (OtrasRutas);

APP.listen (8001, ()=> {
    console.log ("Servidor iniciado en puerto 8001.");
});