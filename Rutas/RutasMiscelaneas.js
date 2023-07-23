const Express = require ("express");
const ROUTER = Express.Router ();
const Pug = require ("pug");

ROUTER.get ("/home", (_req, res, next)=> {
    res.redirect (301, "/Home");
});

ROUTER.get ("/", (_req, res, next)=> {
    res.redirect (301, "/Home");
});

ROUTER.get ("*", (req, res, next)=> {
    let ErrorPug = Pug.renderFile ("./Views/MensajeError.pug", {
        NoError: "404",
        MensajeError: "No se encontró nada en " + req.url
    });
    res.status (404).send (ErrorPug);
    console.log ("Llegó pedido para " + req.url + " pero no se pudo manejar.");
});

ROUTER.post ("*", (req, res, next)=> {
    let ErrorPug = Pug.renderFile ("./Views/MensajeError.pug", {
        NoError: "404",
        MensajeError: "No se encontró nada en " + req.url
    });
    res.status (404).send (ErrorPug);
    console.log ("Llegó pedido para " + req.url + " pero no se pudo manejar.");
});

ROUTER.all ("*", (req, res, next)=> {
    let ErrorPug = Pug.renderFile ("./Views/MensajeError.pug", {
        NoError: "405",
        MensajeError: "No se pudo manejar el pedido a " + req.url + ".<br>Los únicos métodos soportados son GET y POST."
    });
    res.status (405).send (ErrorPug);
    console.log ("No se pudo manejar el pedido a " + req.url + " por usar un método no soportado.");
});

module.exports = ROUTER;