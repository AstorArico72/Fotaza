const Express = require ("express");
const ROUTER = Express.Router ();
module.exports = ROUTER;
//const FuncionesDB = require ("../Controladores/FuncionesDB.js");
const Auth = require ("../Controladores/UserFunctions.js");

ROUTER.post ('/NuevaCuenta', Auth.NewUser);
ROUTER.post ("/SubmitLogin", Auth.LogIn);
ROUTER.get ("/Salir", Auth.LogOut);
