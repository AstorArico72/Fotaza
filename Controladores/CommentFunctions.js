const {Comentarios} = require ("../models");
var OtrasFunciones = require ("./OtrasFunciones.js");

exports.NuevoComentario = async (req, res) => {
    //Éstos datos vienen del formulario que llama a ésta función
    let CommentText = req.body.TextoComentario;
    let OPNumber = req.body.SubidoPor;
    let PostNumber = req.body.PostNo;

    try {
        Comentarios.create ({
            ID_Post: PostNumber,
            ID_Usuario: OPNumber,
            Texto_Comentario: CommentText
        }).then (()=> {
            OtrasFunciones.PaginaErrorPug (res, 201, "Comentario publicado. <a href='/Posts/Ver/" + PostNumber + "'> Atrás </a>");
        });
    } catch (error) {
        OtrasFunciones.PaginaErrorPug (res, 500, "Error con la creación de la cuenta: <br>" + error);
        return;
    }
}

exports.BorrarComentario = async (req, res) => {
    if (req.user == undefined || req.user ["Rol_Usuario"] != "Admin") {
        OtrasFunciones.PaginaErrorPug (res, 403, "Función no permitida.");
    } else {
        Comentarios.findByPk (req.params.ID).then (comment => {
            comment.destroy ();
        }).then (()=> {
            OtrasFunciones.PaginaErrorPug (res, 200, "Comentario borrado.");
        });
    }
}