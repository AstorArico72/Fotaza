const Pug = require ("pug");

function CargarPaginaPugSegura (req, res, ArchivoPug) {
    let OnlineUser;
    let OnlineUserId;
    let Pagina;

    if (typeof req.user !== "undefined") {
        OnlineUser = req.user ["Usuario"];
        OnlineUserId = req.user ["ID_Usuario"];
    } else {
        PaginaErrorPug (req, res, 401, "No estás autenticado. <a href='./Ingresar'>¿Ingresar?</a>");
    }

    try {
        Pagina = Pug.renderFile (ArchivoPug, {
            UsuarioConectado: OnlineUser,
            IdUsuarioConectado: OnlineUserId
        });
        res.status (200).send (Pagina);
    } catch (Exception) {
        PaginaErrorPug (req, res, 500, Exception);
    }
}

function CargarPaginaPugBasica (req, res, ArchivoPug) {
    let OnlineUser;
    let OnlineUserId;
    let Pagina;

    if (typeof req.user !== "undefined") {
        OnlineUser = req.user ["Usuario"];
        OnlineUserId = req.user ["ID_Usuario"];
    } else {
        OnlineUser = "NIL";
        OnlineUserId = "NULL";
    }

    try {
        Pagina = Pug.renderFile (ArchivoPug, {
            UsuarioConectado: OnlineUser,
            IdUsuarioConectado: OnlineUserId

        });
        res.status (200).send (Pagina);
    } catch (Exception) {
        PaginaErrorPug (req, res, 500, Exception);
    }
}

function PaginaErrorPug (req, res, EstadoHTTP, Excepción) {
    let Pagina;
    Pagina = Pug.renderFile ("./Views/MensajeError.pug", {
        NoError: EstadoHTTP,
        MensajeError: Excepción
    });
    res.status (EstadoHTTP).send (Pagina);
}

exports.PaginaErrorPug = PaginaErrorPug;
exports.CargarPaginaPugBasica = CargarPaginaPugBasica;
exports.CargarPaginaPugSegura = CargarPaginaPugSegura;