const JWT = require ("jsonwebtoken");
const {Usuarios, Posts} = require ("../models");
const Pug = require ("pug");
const OtrasFunciones = require ("../Publico/OtrasFunciones.js");
const Formidable = require ("formidable");
const Path = require ("path");
const FS = require ("fs");

exports.VerSubida = async (req, res, _next) => {
    let NumeroSubida = req.params.ID;
    let PostSeleccionado = await Posts.findAll ({
        where: {
            ID: NumeroSubida
        }
    });
    let ContenidoPost = PostSeleccionado [0].Texto_Post;
    let TituloPost = PostSeleccionado [0].Título_Post;
    let FechaSubida = PostSeleccionado [0].createdAt;
    let IdAutor = PostSeleccionado [0].Usuario;
    let AutorPost = await Usuarios.findAll ({
        where: {
            id: PostSeleccionado [0].Usuario
        }
    });
    let NombreOP = AutorPost [0].Nombre_Usuario;

    let OnlineUser;
    let OnlineUserId;

    if (typeof req.user !== "undefined") {
        OnlineUser = req.user ["Usuario"];
        OnlineUserId = req.user ["ID_Usuario"];
    } else {
        OnlineUser = "NIL";
        OnlineUserId = "NULL";
    }

    let FullPost = Pug.renderFile ("./Views/Post.pug", {
        UsuarioConectado: OnlineUser,
        IdUsuarioConectado: OnlineUserId,
        PostTitle: TituloPost,
        PostContent: ContenidoPost,
        OriginalPoster: NombreOP,
        PostNumber: NumeroSubida,
        PostDate: FechaSubida,
        OP_ID: IdAutor
    });
    res.send (FullPost);
}

exports.TodosLosPosts = async (req, res) => {
    let ListaSubidas = await Posts.findAll ({
        attributes: [
            "Título_Post",
            "createdAt",
            "Usuario",
            "id"
        ],
        order: [
            ["createdAt", "DESC"]
        ]
    });

    let ListaPosts = [];
    for (let i= 0; i< ListaSubidas.length; i++) {
        let OP = await Usuarios.findAll ({
            where: {
                id: ListaSubidas [i].Usuario
            }
        });
        let Numero_OP = OP [0].id;
        let Nombre_OP = OP [0].Nombre_Usuario;
        ListaSubidas [i].Numero_OP= Numero_OP;
        ListaSubidas [i].Nombre_OP= Nombre_OP;
        ListaPosts.push (ListaSubidas [i]);
    }

    let OnlineUser;
    let OnlineUserId;

    if (typeof req.user !== "undefined") {
        OnlineUser = req.user ["Usuario"];
        OnlineUserId = req.user ["ID_Usuario"];
    } else {
        OnlineUser = "NIL";
        OnlineUserId = "NULL";
    }

    let Listado = Pug.renderFile ("./Views/AllPosts.pug", {
        UploadList: ListaPosts,
        UsuarioConectado: OnlineUser,
        IdUsuarioConectado: OnlineUserId
    });
    res.send (Listado);
}

exports.PaginaSubida = (req, res, _next) => {
    OtrasFunciones.CargarPaginaPugSegura (req, res, "./Views/NuevoPost.pug");
}

exports.NuevoPost = async (req, res) => {
    let DirectorioSubida = Path.join (__dirname, "../Medios");
    let DatosSubidos = new Formidable.IncomingForm ();
    DatosSubidos.uploadDir = DirectorioSubida;
    DatosSubidos.multiples = false;
    DatosSubidos.maxFileSize = 10485760; // 10 MiB.
    var UrlMedios;
    var CamposFormulario = {};
    try {
        DatosSubidos.parse (req, async (_error, fields, files)=> {
            console.log (fields);
            console.log (files);

            let Foto = files.PostMedia [0];
            if (Foto.size > DatosSubidos.maxFileSize) {
                OtrasFunciones.PaginaErrorPug (req, res, 400, "El archivo es muy grande. (Límite: 10 MiB)");
            }
            let NombreTruncado = encodeURIComponent(Foto.originalFilename.replace(/\s/g, "-"));
            let Ahora = new Date ();
            let NombreArchivo = Ahora.getFullYear () + "-" + Ahora.getMonth () + "-" + Ahora.getDay () + "-" + Ahora.getHours () + "-" + Ahora.getMinutes () + "-" + Ahora.getSeconds () + "-" + NombreTruncado;
            FS.renameSync (Foto.filepath, Path.join (DirectorioSubida, NombreArchivo));
            UrlMedios = "/Medios/" + NombreArchivo;
            CamposFormulario.TituloPost = fields.TituloPost [0];
            CamposFormulario.SubidoPor = parseInt(fields.SubidoPor [0]);
            CamposFormulario.TextoPost = fields.TextoPost [0];
        }).then (() => {
            Posts.create ({
                Título_Post: CamposFormulario.TituloPost,
                Usuario: CamposFormulario.SubidoPor,
                Texto_Post: CamposFormulario.TextoPost,
                URL_Medios: UrlMedios
            });
        });
    } catch (error) {
        OtrasFunciones.PaginaErrorPug (req, res, 500, "Error con la subida:<br>" + error);
    } finally {
        res.redirect ("..");
    }
}