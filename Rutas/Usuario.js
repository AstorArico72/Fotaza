const Express = require ("express");
const ROUTER = Express.Router ();
module.exports = ROUTER;
//const FuncionesDB = require ("../Controladores/FuncionesDB.js");
const Auth = require ("../Controladores/Auth.js");

ROUTER.post ('/NuevaCuenta', Auth.NewUser);
ROUTER.post ("/SubmitLogin", Auth.LogIn);

/**
function Nuevo (Usuario) {
    int resultado = -1;
    try {
        using (var con = new MySqlConnection (ConnectionString)) {
            string SQLQuery = @"INSERT INTO Usuarios (Nombre, Clave, Rol) VALUES (@Nombre, @Clave, @Rol); SELECT LAST_INSERT_ID ()";
            using (var comm = new MySqlCommand (SQLQuery, con)) {
                comm.Parameters.AddWithValue ("@Nombre", u.NombreUsuario);
                Usuario.Clave = Convert.ToBase64String(KeyDerivation.Pbkdf2(
		            password: u.Clave,
		            salt: System.Text.Encoding.ASCII.GetBytes("No-es-Instagram"),
		            prf: KeyDerivationPrf.HMACSHA256,
		            iterationCount: 1000,
		            numBytesRequested: 256 / 8
                ));
                comm.Parameters.AddWithValue ("@Clave", u.Clave);
                comm.Parameters.AddWithValue ("@Rol", u.Rol);
                con.Open ();
                resultado = Convert.ToInt32 (comm.ExecuteScalar ());
                con.Close ();
            }
        }
    } catch (MySqlException ex) {
        throw ex;
    }
    return resultado;
}
 */