const Express = require ("express");
const ROUTER = Express.Router ();
module.exports = ROUTER;
//const FuncionesDB = require ("../Controladores/FuncionesDB.js");
const FuncionesUsuario = require ("../Controladores/UserFunctions.js");

ROUTER.post ('/NuevaCuenta', FuncionesUsuario.NewUser);
ROUTER.post ("/SubmitLogin", FuncionesUsuario.LogIn);
ROUTER.get ("/Salir", FuncionesUsuario.LogOut);
ROUTER.get ("/Perfil/:ID", FuncionesUsuario.Autenticador, FuncionesUsuario.PerfilUsuario);
ROUTER.get ("/EditarPerfil", FuncionesUsuario.Autenticador, FuncionesUsuario.EditUser);
ROUTER.post ("/EditarCuenta", FuncionesUsuario.Autenticador, FuncionesUsuario.SubirCambios);
ROUTER.get ("/CambiarClave", FuncionesUsuario.Autenticador, FuncionesUsuario.EditPassword);
ROUTER.post ("/GuardarClave", FuncionesUsuario.Autenticador, FuncionesUsuario.CambiarClave);
ROUTER.get ('/Ingresar', FuncionesUsuario.Autenticador, FuncionesUsuario.Ingresar);