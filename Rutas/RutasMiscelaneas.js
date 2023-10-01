const Express = require ("express");
const ROUTER = Express.Router ();
const Pug = require ("pug");
const { Autenticador } = require("../Controladores/UserFunctions");
var OtrasFunciones = require("../Controladores/OtrasFunciones.js");

ROUTER.get ("/Home", Autenticador, (req, res, next)=> {
    OtrasFunciones.CargarPaginaPugBasica (req, res, "./Views/Home.pug");
});

ROUTER.get ("/home", (_req, res, next)=> {
    res.redirect (301, "/Home");
});

ROUTER.get ("/", (_req, res, next)=> {
    res.redirect (301, "/Home");
});

ROUTER.get ("*", (req, res, next)=> {
    OtrasFunciones.PaginaErrorPug (res, 404, "No se encontró nada en " + req.url);
});

ROUTER.post ("*", (req, res, next)=> {
    OtrasFunciones.PaginaErrorPug (res, 404, "No se encontró nada en " + req.url);
});

ROUTER.all ("*", (req, res, next)=> {
    OtrasFunciones.PaginaErrorPug (res, 501, "No se pudo manejar el pedido a " + req.url + ".<br>Los únicos métodos soportados son GET y POST.");
});

module.exports = ROUTER;