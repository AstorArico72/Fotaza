const JWT = require ("jsonwebtoken");
const {Usuarios, Posts} = require ("../models");
const Pug = require ("pug");

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