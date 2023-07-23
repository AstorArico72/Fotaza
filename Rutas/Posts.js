const Express = require ("express");
const ROUTER = Express.Router ();
module.exports = ROUTER;
const FuncionesPost = require ("../Controladores/PostFunctions.js");

ROUTER.get ("/", FuncionesPost.TodosLosPosts);
ROUTER.get ("/Ver/:ID", FuncionesPost.VerSubida);