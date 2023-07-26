const Express = require ("express");
const ROUTER = Express.Router ();
module.exports = ROUTER;
const FuncionesPost = require ("../Controladores/PostFunctions.js");
const Auth = require ("../Controladores/Auth.js");

ROUTER.get ("/", Auth.Autenticador, FuncionesPost.TodosLosPosts);
ROUTER.get ("/Ver/:ID", Auth.Autenticador, FuncionesPost.VerSubida);
ROUTER.get ("/Subir", Auth.Autenticador, FuncionesPost.PaginaSubida);
ROUTER.post ("/Nuevo", Auth.Autenticador, FuncionesPost.NuevoPost);