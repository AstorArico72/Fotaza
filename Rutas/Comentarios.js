const Express = require ("express");
const ROUTER = Express.Router ();
const FuncionesComentario = require ("../Controladores/CommentFunctions.js");
const Auth = require ("../Controladores/UserFunctions.js");

ROUTER.post ("/Nuevo", Auth.Autenticador, FuncionesComentario.NuevoComentario);
ROUTER.get ("/Borrar/:ID", Auth.Autenticador, FuncionesComentario.BorrarComentario);

module.exports = ROUTER;