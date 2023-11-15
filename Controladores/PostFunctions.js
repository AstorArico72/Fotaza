const {Usuarios, Posts, Comentarios, Votos, VotosUsuarios, sequelize, Sequelize} = require ("../models");
const Pug = require ("pug");
var OtrasFunciones = require ("./OtrasFunciones.js");
const Path = require ("path");
const FS = require ("fs");
const {formidable, errors} = require ("formidable");

exports.VerSubida = async (req, res, _next) => {
    let ListadoLicencias = require ("../Publico/Licencias.json");
    let ListadoCategorías = require ("../Publico/Categorías.json");
    let NumeroSubida = req.params.ID;
    let PostSeleccionado;
    let PuntuaciónPost;
    let TotalVotos;
    let VotosPost = await Votos.findAll ({
        where: {
            Post: NumeroSubida
        }
    });
    let OnlineUser;
    let OnlineUserId;
    let UserRole;
    let PermitirVoto;
    let VotoDelUsuario = null;

    if (typeof req.user !== "undefined") {
        OnlineUser = req.user ["Usuario"];
        OnlineUserId = req.user ["ID_Usuario"];
        UserRole = req.user ["Rol_Usuario"];
    } else {
        OnlineUser = "NIL";
        OnlineUserId = "NULL";
    }

    if (OnlineUserId != "NULL" || OnlineUserId !== undefined) {
        VotoDelUsuario = await VotosUsuarios.findAll ({
            where: {
                Usuario: OnlineUserId,
                Post: NumeroSubida
            }
        });
    }

    if (VotoDelUsuario == null) {
        PermitirVoto = false;
    } else {
        if (VotoDelUsuario.length == 0) {
            PermitirVoto = true;
        }
    }

    if (VotosPost.length == 0) {
        PuntuaciónPost = null;
    } else {
        VotosPost = VotosPost [0];
        let Votos5 = parseInt (VotosPost.Votos5);
        let Votos4 = parseInt (VotosPost.Votos4);
        let Votos3 = parseInt (VotosPost.Votos3);
        let Votos2 = parseInt (VotosPost.Votos2);
        let Votos1 = parseInt (VotosPost.Votos1);
        let Votos0 = parseInt (VotosPost.Votos0);
        let SumaPuntuacion = 5 * Votos5 + 4 * Votos4 + 3 * Votos3 + 2 * Votos2 + 1 * Votos1 + 0 * Votos0;
        TotalVotos = Votos5 + Votos4 + Votos3 + Votos2 + Votos1 + Votos0;
        PuntuaciónPost = SumaPuntuacion / TotalVotos;
        PuntuaciónPost = PuntuaciónPost.toFixed (2);
    }

    if (OnlineUser == "NIL") {
        PostSeleccionado = await Posts.findAll ({
            where: {
                ID: NumeroSubida,
                Visibilidad: "Público"
            }
        });
        if (PostSeleccionado.length == 0) {
            OtrasFunciones.PaginaErrorPug (res, 403, "Ésa subida está restringida a usuarios.");
            return;
        }
    } else {
        PostSeleccionado = await Posts.findAll ({
            where: {
                ID: NumeroSubida
            }
        });
    }

    if (PostSeleccionado.length != 0) {
        let Foto;
        if (PostSeleccionado [0].URL_Medios != null || PostSeleccionado [0].URL_Medios != undefined) {
            Foto = PostSeleccionado [0].URL_Medios;
        } else {
            Foto = "/Medios/null";
        }
        let ContenidoPost = PostSeleccionado [0].Texto_Post;
        let TituloPost = PostSeleccionado [0].Título_Post;
        let FechaSubida = PostSeleccionado [0].createdAt;
        let IdAutor = PostSeleccionado [0].Usuario;
        let Licencia = PostSeleccionado [0].Licencia_Foto;
        let AutorPost = await Usuarios.findAll ({
            where: {
                id: PostSeleccionado [0].Usuario
            }
        });

        let NombreOP = AutorPost [0].Nombre_Usuario;
        let TagsPost;
        let LicenciaFoto;
        let Categoría = PostSeleccionado [0].Categoría_Post;
        let CategoríaPost;
        let ColorPrincipal;
        let SeparadorComa = new RegExp (/\,\s/, "g");

        if (PostSeleccionado [0].Etiquetas_Post != null) {
            TagsPost = PostSeleccionado [0].Etiquetas_Post.split (SeparadorComa);
            TagsPost = TagsPost.join (", ");
        }

        switch (Licencia) {
            case "CC-BY":
                LicenciaFoto = ListadoLicencias.CC.BY;
                break;
            case "CC-BY-SA":
                LicenciaFoto = ListadoLicencias.CC["BY-SA"];
                break;
            case "CC-BY-NC":
                LicenciaFoto = ListadoLicencias.CC["BY-NC"];
                break;
            case "CC-BY-ND":
                LicenciaFoto = ListadoLicencias.CC["BY-ND"];
                break;
            case "CC-BY-NC-ND":
                LicenciaFoto = ListadoLicencias.CC["BY-NC-ND"];
                break;
            case "CC-BY-NC-SA":
                LicenciaFoto = ListadoLicencias.CC["BY-NC-SA"];
                break;
            case "CC0":
                LicenciaFoto = ListadoLicencias.Public.CC0;
                break;
            case "Public":
                LicenciaFoto = ListadoLicencias.Public.PD;
                break;
            case "Copyright":
                LicenciaFoto = ListadoLicencias.Copyright;
                break;
            default:
                LicenciaFoto = "<div class='card'>Ésta obra no está bajo ninguna licencia.</div>"
                break;
        }

        switch (Categoría) {
            case null:
                CategoríaPost = "Sin categoría";
                ColorPrincipal = ListadoCategorías.Colores.Nada;
                break;
        
            default:
                CategoríaPost = ListadoCategorías.Categorías [Categoría];
                ColorPrincipal = ListadoCategorías.Colores [Categoría];
                break;
        }

        let ComentariosPost = await Comentarios.findAll ({
            where: {
                ID_Post: NumeroSubida
            }
        });
        let ListaComentarios = [];
        if (ComentariosPost.length != 0) {
            for (let i= 0; i < ComentariosPost.length; i++) {
                let AutorComentario = await Usuarios.findAll ({
                    where: {
                        ID: ComentariosPost [i].ID_Usuario
                    }
                });
                ListaComentarios [i] = {
                    TextoComentario: ComentariosPost [i].Texto_Comentario,
                    NombreOP: AutorComentario [0].Nombre_Usuario,
                    FechaSubida: ComentariosPost [i].createdAt
                }
            }
        } else {
            ListaComentarios = null;
        }

        let FullPost = Pug.renderFile ("./Views/Post.pug", {
            UsuarioConectado: OnlineUser,
            IdUsuarioConectado: OnlineUserId,
            RolUsuario: UserRole,
            PostTitle: TituloPost,
            PostContent: ContenidoPost,
            OriginalPoster: NombreOP,
            PostNumber: NumeroSubida,
            PostDate: FechaSubida,
            License: LicenciaFoto,
            OP_ID: IdAutor,
            UrlImagen: Foto,
            Etiquetas: TagsPost,
            CategoríaPost: CategoríaPost,
            Comentarios: ListaComentarios,
            ColorCategoría: ColorPrincipal,
            PuntuaciónPost: PuntuaciónPost,
            VotosPost: TotalVotos,
            PermitirVoto: PermitirVoto
        });
        res.send (FullPost);
    } else {
        OtrasFunciones.PaginaErrorPug (res, 404, "No se encontró ése post.");
        return;
    }
}

exports.TodosLosPosts = async (req, res) => {
    let OnlineUser;
    let OnlineUserId;

    if (typeof req.user !== "undefined") {
        OnlineUser = req.user ["Usuario"];
        OnlineUserId = req.user ["ID_Usuario"];
    } else {
        OnlineUser = "NIL";
        OnlineUserId = "NULL";
    }

    let ListadoCategorías = require ("../Publico/Categorías.json");
    let ListaSubidas = await Posts.findAll ({
        attributes: [
            "Título_Post",
            "createdAt",
            "Usuario",
            "ID",
            "Etiquetas_Post",
            "Categoría_Post",
            "Visibilidad"
        ],
        order: [
            ["createdAt", "DESC"]
        ]
    });

    let ListaPosts = [];
    let SeparadorComa = new RegExp (/\,\s/, "g");

    for (let i= 0; i< ListaSubidas.length; i++) {
        let OP = await Usuarios.findAll ({
            where: {
                id: ListaSubidas [i].Usuario
            }
        });
        let Numero_OP = OP [0].id;
        let Nombre_OP = OP [0].Nombre_Usuario;
        if (ListaSubidas [i].Etiquetas_Post != null) {
            let Tags = ListaSubidas [i].Etiquetas_Post.split (SeparadorComa);
            ListaSubidas [i].Etiquetas= Tags.join (", ");
        }
        let CategoríaPost = ListaSubidas [i].Categoría_Post;
        let ColorPost;
        switch (CategoríaPost) {
            case null:
                ColorPost = ListadoCategorías.Colores.Nada;
                break;
        
            default:
                ColorPost = ListadoCategorías.Colores [CategoríaPost];
                break;
        }
        ListaSubidas [i].Numero_OP= Numero_OP;
        ListaSubidas [i].Nombre_OP= Nombre_OP;
        ListaSubidas [i].Color_Fondo= ColorPost;

        if (OnlineUser == "NIL" || OnlineUser == undefined) {
            if (ListaSubidas [i].Visibilidad == "Público") {
                ListaPosts.push (ListaSubidas [i]);
            }
        } else {
            ListaPosts.push (ListaSubidas [i]);
        }
    }

    let Listado = Pug.renderFile ("./Views/AllPosts.pug", {
        UploadList: ListaPosts,
        UsuarioConectado: OnlineUser,
        IdUsuarioConectado: OnlineUserId
    });
    res.send (Listado);
}

exports.BorrarPost = async (req, res) => {
    if (req.user == undefined || req.user ["Rol_Usuario"] != "Admin") {
        OtrasFunciones.PaginaErrorPug (res, 403, "Función no permitida.");
    } else {
        Posts.findByPk (req.params.ID).then (post => {
            post.destroy ();
        }).then (()=> {
            res.redirect ("..");
        });
    }
}

exports.BuscarPosts = async (req, res) => {
    let ListadoCategorías = require ("../Publico/Categorías.json");
    let SequelizeQuery = "SELECT `Título_Post`, `createdAt`, `Usuario`, `ID`, `Etiquetas_Post`, `Categoría_Post`, `Licencia_Foto` FROM `Posts` AS `Posts` WHERE ";
    switch (req.query.Tag) {
        case "null" || undefined:
            SequelizeQuery += "`Posts`.`Etiquetas_Post` IS NULL ";
            break;
        case "Todas":
            SequelizeQuery += "`Posts`.`Etiquetas_Post` IS NOT NULL ";
            break;
        default:
            SequelizeQuery += "`Posts`.`Etiquetas_Post` LIKE \"%" + req.query.Tag + "%\" ";
            break;
    }
    switch (req.query.Categoria) {
        case "null" || undefined:
            SequelizeQuery += "AND `Posts`.`Categoría_Post` IS NULL ";
            break;
        case "Todas":
            //Saltar el parámetro
            break;
        default:
            SequelizeQuery += "AND `Posts`.`Categoría_Post`=\"" + req.query.Categoria + "\" ";
            break;
    }
    switch (req.query.Licencia) {
        case "null" || undefined:
            SequelizeQuery += "AND `Posts`.`Licencia_Foto` IS NULL ";
            break;
        case "Todas":
            //Saltar el parámetro
            break;
        default:
            SequelizeQuery += "AND `Posts`.`Licencia_Foto`=\"" + req.query.Licencia + "\" ";
            break;
    }
    switch (req.query.Usuario) {
        case "null" || undefined:
            //Saltar el parámetro
            break;
        default:
            SequelizeQuery += "AND `Posts`.`Usuario`=\"" + req.query.Usuario + "\" ";
            break;
    }
    SequelizeQuery += "ORDER BY `Posts`.`createdAt` DESC;";
    let ListaSubidas = await sequelize.query (SequelizeQuery, {
        model: Posts,
        mapToModel: true
    });

    let ListaPosts = [];
    let SeparadorComa = new RegExp (/\,\s/, "g");

    for (let i= 0; i< ListaSubidas.length; i++) {
        let OP = await Usuarios.findAll ({
            where: {
                id: ListaSubidas [i].Usuario
            }
        });
        let Numero_OP = OP [0].id;
        let Nombre_OP = OP [0].Nombre_Usuario;
        if (ListaSubidas [i].Etiquetas_Post != null) {
            let Tags = ListaSubidas [i].Etiquetas_Post.split (SeparadorComa);
            ListaSubidas [i].Etiquetas= Tags.join (", ");
        }
        let CategoríaPost = ListaSubidas [i].Categoría_Post;
        let ColorPost;
        switch (CategoríaPost) {
            case null:
                ColorPost = ListadoCategorías.Colores.Nada;
                break;
        
            default:
                ColorPost = ListadoCategorías.Colores [CategoríaPost];
                break;
        }
        ListaSubidas [i].Numero_OP= Numero_OP;
        ListaSubidas [i].Nombre_OP= Nombre_OP;
        ListaSubidas [i].Color_Fondo= ColorPost;
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
        IdUsuarioConectado: OnlineUserId,
        QueryBusqueda: "Etiqueta(s): " + req.query.Tag + ", Categoría: " + req.query.Categoria + ", Licencia: " + req.query.Licencia + ", Usuario: " + req.query.Usuario
    });
    res.send (Listado);
}

exports.PaginaSubida = (req, res, _next) => {
    OtrasFunciones.CargarPaginaPugSegura (req, res, "./Views/NuevoPost.pug");
}

exports.NuevoPost = async (req, res) => {
    let OpcionesArchivo = require ("../Index.js");
    let DirectorioSubida = Path.join (__dirname, "../Medios");
    let Licencia;
    let Categoría;
    let Visibilidad_Post;
    var CancelarSubida = false;
    const OpcionesFormulario = {
        keepExtensions: true,
        allowEmptyFiles: false,
        uploadDir: DirectorioSubida,
        multiples: false,
        maxFileSize: 10485760,
        filter: function ({name, originalFilename, mimetype}) {
            var HayArchivo = originalFilename !== "";
            var MimeValido = OpcionesArchivo.OpcionesArchivo.mime.includes (mimetype);
            if (!MimeValido && HayArchivo) {
                DatosSubidos.emit ('error', new errors.default ("El tipo MIME del archivo subido es inválido", 0, 415));
                CancelarSubida = true;
            }
            return MimeValido && !CancelarSubida;
        }
    };
    var DatosSubidos = formidable (OpcionesFormulario);

    var UrlMedios = null;
    var CamposFormulario = {
        TituloPost: "",
        SubidoPor: null,
        TextoPost: "",
        EtiquetasPost: ""
    };
    let SeparadorComa = new RegExp (/\,\s/, "g");
    let SubirDatos = new Promise ((resolve, reject) => {
        DatosSubidos.parse (req, (error, fields, files)=> {
            console.log (fields);
            CamposFormulario ["TituloPost"] = fields.TituloPost [0];
            CamposFormulario ["SubidoPor"] = fields.SubidoPor [0];
            CamposFormulario ["TextoPost"] = fields.TextoPost [0];
            if (fields.Categoría == undefined || fields.Categoría == "") {
                Categoría = null;
            } else {
                Categoría = fields.Categoría [0];
            }
            if (fields.Licencia == undefined || fields.Licencia == "") {
                Licencia = null;
            } else {
                Licencia = fields.Licencia [0];
            }
            if (fields.Licencia [0] == "Copyright") {
                Visibilidad_Post = "Usuarios";
            } else {
                Visibilidad_Post = fields.Visibilidad [0];
            }

            if (files.PostMedia !== undefined) {
                let Foto = files.PostMedia [0];
                let NombreTruncado = encodeURIComponent(Foto.originalFilename.replace(/\s/g, "-"));
                let Ahora = new Date ();
                let NombreArchivo = Ahora.getFullYear () + "-" + (Ahora.getMonth () +1)+ "-" + Ahora.getDate ()+ "-" + Ahora.getHours () + "-" + Ahora.getMinutes () + "-" + Ahora.getSeconds () + "-" + NombreTruncado;
                FS.renameSync (Foto.filepath, Path.join (DirectorioSubida, NombreArchivo));
                UrlMedios = "/Medios/" + NombreArchivo;
            }
            
            if (typeof (fields.TagsPost [0]) != "undefined") {
                let Tags = fields.TagsPost [0].split (SeparadorComa);
                if (Tags.length > 3) {
                    OtrasFunciones.PaginaErrorPug (res, 400, "El límite es de 3 etiquetas.");
                    return;
                } else {
                    CamposFormulario ["EtiquetasPost"] = fields.TagsPost [0];
                }
            } else {
                CamposFormulario ["EtiquetasPost"] = null;
            }
            if (!error) {
                resolve (CamposFormulario);
            } else {
                console.log ("Subida cancelada: " + error);
                return OtrasFunciones.PaginaErrorPug (res, error.httpCode, error);
            }
        });
    });
    try {
        SubirDatos.then ((data)=> {
            console.log (data);
            Posts.create ({
                Título_Post: data ["TituloPost"],
                Usuario: data ["SubidoPor"],
                Texto_Post: data ["TextoPost"],
                URL_Medios: UrlMedios,
                Etiquetas_Post: data ["EtiquetasPost"],
                Licencia_Foto: Licencia,
                Categoría_Post: Categoría,
                Visibilidad: Visibilidad_Post
            });
        }).then (()=> {
            res.redirect ("..");
        })
    } catch (error) {
            OtrasFunciones.PaginaErrorPug (res, 400, "Error con la subida:<br>" + error);
    }
}

exports.VotarPost = (async (req, res, next) => {
    let OnlineUserId = req.user ["ID_Usuario"];
    let PostId = req.body.PostId;
    let VotoDelUsuario = await VotosUsuarios.findAll ({
        where: {
            Usuario: OnlineUserId,
            Post: PostId
        }
    });
    if (OnlineUserId == undefined) {
        OtrasFunciones.PaginaErrorPug (res, 401, "No estás autenticado. <a href='/Usuario/Ingresar'>¿Ingresar?</a>");
    }
    let Voto = parseInt (req.body.rating);
    let PostVotado = await Votos.findAll ({
        where: {
            Post: PostId
        }
    });
    
    if (VotoDelUsuario.length == 0) {
        if (PostVotado.length == 0) {
            PostVotado = await Votos.create ({
                Post: PostId
            });
        } else {
            PostVotado = PostVotado [0];
        }
        let SequelizeQuery = "UPDATE `Votos` SET";
        try {
            switch (Voto) {
                case 5:
                    SequelizeQuery += " `Votos5` = `Votos5` + 1 ";
                    break;
                case 4:
                    SequelizeQuery += " `Votos4` = `Votos4` + 1 ";
                    break;
                case 3:
                    SequelizeQuery += " `Votos3` = `Votos3` + 1 ";
                    break;
                case 2:
                    SequelizeQuery += " `Votos2` = `Votos2` + 1 ";
                    break;
                case 1:
                    SequelizeQuery += " `Votos1` = `Votos1` + 1 ";
                    break;
                case 0:
                    SequelizeQuery += " `Votos0` = `Votos0` + 1 ";
                    break;
                default:
                    break;
            }
            SequelizeQuery += "WHERE `Post` = " + PostId + ";";
            sequelize.query (SequelizeQuery).then (()=> {
                VotosUsuarios.create ({
                    Usuario: OnlineUserId,
                    Post: PostId
                });
            }).then (()=> {
                res.redirect (301, "/Posts/Ver/" + PostId);
            })
        } catch (error) {
            OtrasFunciones.PaginaErrorPug (res, error.httpCode || 500, error);
        }
    } else {
        OtrasFunciones.PaginaErrorPug (res, 403, "Parece que ya has votado ése post.");
    }
});