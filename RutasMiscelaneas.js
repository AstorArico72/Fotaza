const Express = require ("express");
const ROUTER = Express.Router ();
const Pug = require ("pug");

ROUTER.get ("/home", (_req, res, next)=> {
    res.redirect (301, "/Home");
});

ROUTER.get ("/", (_req, res, next)=> {
    res.redirect (301, "/Home");
});

ROUTER.all ("*", (req, res, next)=> {
    let ErrorPug = Pug.renderFile ("./Publico/MensajeError.pug", {
        NoError: "404",
        MensajeError: "No se encontró nada en " + req.url
    });
    res.status (404).send (ErrorPug);
    console.log ("Llegó pedido para " + req.url + " pero no se pudo manejar.");
});

module.exports = ROUTER;