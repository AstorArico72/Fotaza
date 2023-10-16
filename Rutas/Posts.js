const Express = require ("express");
const ROUTER = Express.Router ();
module.exports = ROUTER;
const FuncionesPost = require ("../Controladores/PostFunctions.js");
const Auth = require ("../Controladores/UserFunctions.js");

ROUTER.get ("/", Auth.Autenticador, FuncionesPost.TodosLosPosts);
ROUTER.get ("/Ver/:ID", Auth.Autenticador, FuncionesPost.VerSubida);
ROUTER.get ("/Subir", Auth.Autenticador, FuncionesPost.PaginaSubida);
ROUTER.get ("/Borrar/:ID", Auth.Autenticador, FuncionesPost.BorrarPost);
ROUTER.get ("/Buscar", Auth.Autenticador, FuncionesPost.BuscarPosts);
ROUTER.post ("/Nuevo", Auth.Autenticador, FuncionesPost.NuevoPost);