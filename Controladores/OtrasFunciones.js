const Pug = require ("pug");

function CargarPaginaPugSegura (req, res, ArchivoPug) {
    let OnlineUser;
    let OnlineUserId;
    let Pagina;

    if (typeof req.user !== "undefined") {
        OnlineUser = req.user ["Usuario"];
        OnlineUserId = req.user ["ID_Usuario"];
    } else {
        PaginaErrorPug (res, 401, "No estás autenticado. <a href='./Ingresar'>¿Ingresar?</a>");
        return;
    }

    try {
        Pagina = Pug.renderFile (ArchivoPug, {
            UsuarioConectado: OnlineUser,
            IdUsuarioConectado: OnlineUserId
        });
        res.status (200).send (Pagina);
    } catch (Exception) {
        PaginaErrorPug (res, 500, Exception);
        return;
    }
}

function CargarPaginaPugBasica (req, res, ArchivoPug) {
    let OnlineUser = OtrasFunciones.HayUsuario (req).NombreUsuario;
    let OnlineUserId = OtrasFunciones.HayUsuario (req).IdUsuario;
    let Pagina;

    try {
        Pagina = Pug.renderFile (ArchivoPug, {
            UsuarioConectado: OnlineUser,
            IdUsuarioConectado: OnlineUserId

        });
        res.status (200).send (Pagina);
    } catch (Exception) {
        PaginaErrorPug (res, 500, Exception);
        return;
    }
}

function PaginaErrorPug (res, EstadoHTTP, Excepción) {
    let Pagina;
    Pagina = Pug.renderFile ("./Views/MensajeError.pug", {
        NoError: EstadoHTTP,
        MensajeError: Excepción
    });
    res.status (EstadoHTTP).send (Pagina);
}

function HayUsuario (req) {
    let UsuarioConectado = {
        IdUsuario: null,
        NombreUsuario: null,
        RolUsuario: null
    };
    if (typeof req.user !== "undefined") {
        UsuarioConectado.NombreUsuario = req.user ["Usuario"];
        UsuarioConectado.IdUsuario = req.user ["ID_Usuario"];
        UsuarioConectado.RolUsuario = req.user ["Rol_Usuario"];
    }
    return UsuarioConectado
}

exports.PaginaErrorPug = PaginaErrorPug;
exports.CargarPaginaPugBasica = CargarPaginaPugBasica;
exports.CargarPaginaPugSegura = CargarPaginaPugSegura;
exports.HayUsuario = HayUsuario;