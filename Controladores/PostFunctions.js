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
    let AutorPost = await Usuarios.findAll ({
        where: {
            ID: PostSeleccionado [0].Usuario
        }
    });
    let NombreOP = AutorPost [0].Nombre_Usuario;

    let FullPost = Pug.renderFile ("./Views/Post.pug", {
        PostTitle: TituloPost,
        PostContent: ContenidoPost,
        OriginalPoster: NombreOP,
        PostNumber: NumeroSubida,
        PostDate: FechaSubida
    });
    res.send (FullPost);
}

exports.TodosLosPosts = async (req, res) => {
    let ListaSubidas = await Posts.findAll ({
        attributes: [
            "Título_Post",
            "createdAt",
            "Usuario"
        ],
        order: [
            ["createdAt", "DESC"]
        ]
    });
    let ListaAutores = [];
    for (let x=0; x< ListaSubidas.length; x++) {
        let AutorPost = await Usuarios.findAll ({
            where: {
                ID: ListaSubidas [x].Usuario
            }
        });
        ListaAutores.push (AutorPost [0].Nombre_Usuario);
    }

    let Listado = Pug.renderFile ("./Views/AllPosts.pug", {
        PostList: ListaSubidas,
        OPsList: ListaAutores
    });
    res.send (Listado);
}