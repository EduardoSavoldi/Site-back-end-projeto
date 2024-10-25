const express = require('express');
const {Sequelize, DataTypes} = require('sequelize');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
const sequelize = new Sequelize('dbsite', 'root', '84029162', {
    host: "localhost",
    dialect: 'mysql',
    omitNull: true
});

const app = express();
const port = 8383;

app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.json());
app.use(session({
    secret: 'xubirabsbrau',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 * 15, httpOnly: true } //15min
}));

const Usuario = sequelize.define('t_usuarios', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING(80),
        allowNull: false
    },
    sobrenome: {
        type: DataTypes.STRING(80),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(150),
        unique: true,
        allowNull: false
    },
    celular: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    senha: {
        type: DataTypes.TEXT,
        allowNull: false
    }
},{
    tableName: 't_usuarios'
})

const Comentario = sequelize.define('t_comentarios', {
    id_comentarios: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 't_usuarios',
            key: 'id_usuario'
        },
        onDelete: 'CASCADE'
    },
    id_parent: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 't_comentarios',
            key: 'id_comentario'
        },
        onDelete: 'CASCADE'
    },
    mensagem: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    materias: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
},{
    tableName: 't_comentarios'
})

const Likes = sequelize.define('t_likes', {
    id_likes: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 't_usuarios',
            key: 'id_usuario'
        },
        onDelete: 'CASCADE'
    },
    id_comentario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 't_comentarios',
            key: 'id_comentario'
        },
        onDelete: 'CASCADE'
    },
},{
    indexes: [
        {
          unique: true,
          fields: ['id_usuario', 'id_comentario']
        }
      ]
},{
    tableName: 't_likes'
})

const ComentarioProvisorio = sequelize.define('t_comentariosprovisorios', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    materias: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    html: {
        type: DataTypes.TEXT,
        allowNull: false
    }
},{
    tableName: 't_comentariosprovisorio',
    timestamps: false
})

Usuario.hasMany(Comentario, { foreignKey: 'id_usuario', as: 'comentarios' });
Comentario.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

async function testConnection() {
    try {
      await sequelize.authenticate();
      console.log('Conexão com o banco de dados bem-sucedida!');
    } catch (error) {
      console.error('Erro ao conectar ao banco de dados:', error);
    }
  }

testConnection();

// REGISTRO
app.post('/registro', (req, res) => {
    const {nome, sobrenome, email, celular, senha} = req.body;
    if(!req.body){
        return res.status(400).send({status: 'failed'});
    }
    async function criarUsuario(){
            const checkEmail = await Usuario.findOne({where: {email}})
            const senhaHash = await bcrypt.hash(senha, 10)
            if(!checkEmail){
                try{
                    await Usuario.create({
                        nome: nome,
                        sobrenome: validarNull(sobrenome),
                        email: email,
                        celular: validarNull(celular),
                        senha: senhaHash
                    })
                    return res.status(201).send({mensagem: `Usuario registrado com sucesso`});
                }
                catch(erro){
                    console.error('Erro inesperado', erro);
                    return res.status(500).send({erro: `Erro desconhecido: ${erro}`});
                }
            }
            else if(checkEmail){
                console.error(`ERRO: Email já cadastrado`);
                return res.status(409).send({erro: `Email já cadastrado`});
            }
    }

    criarUsuario();
})

//LOGIN
app.post('/login', (req, res) => {
    const {email, senha} = req.body
    async function importarUsuario(){
        try{
            const usuario = await Usuario.findOne({where: {email}})
            if(!usuario){
                return res.status(404).json({ erro: 'Email não encontrado'});
            }
            const senhaValida  = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                return res.status(401).json({ erro: 'Senha incorreta'});
            }
            else{
                req.session.usuario = 
                {id: usuario.id_usuario,
                nome: usuario.nome,
                sobrenome: usuario.sobrenome,
                email: usuario.email,
                celular: usuario.celular
                 };

                return res.status(200).json({mensagem: 'Login efetuado com sucesso'})
            }
        }
        catch(erro){
            console.error('Erro ao fazer login:', erro);
            res.status(500).json({ error: 'Erro inesperado. Tente novamente mais tarde.' });
        }
    }

    importarUsuario();
})

/*
//ADICIONAR COMENTAIO AO DB
app.post('/addcomentario', (req, res) => {
    const {mensagem, tipo, materia, html} = req.body;
    async function salvarHtml(){
        const achar = await ComentarioProvisorio.findOne({where: {materias: materia}})
        if(!achar){
            await ComentarioProvisorio.create({
                materias: materia,
                html: sanitizeHtml(html)
            })
        }
        else if(achar){
            await ComentarioProvisorio.update({
                html: sanitizeHtml(html)
            }, {
                where: {materias: materia}
            })
        }
        await console.log(achar)
    }
    salvarHtml();
    /*
    let usuario, id_usuario;
    if(req.session.usuario){
        usuario = req.session.usuario
        nome = usuario.nome;
        id_usuario = usuario.id;
    }
    else if(!req.session.usuario){
        nome = 'anônimo'
        id_usuario = 1;
    }

    async function addComentario(){
        try{
            Comentario.create({
                id_usuario: id_usuario,
                mensagem: mensagem,
                materias: materia
            })
            }
        catch(erro){
            console.error(`Erro ao adicionar a/o ${tipo} ao banco`, erro);
            res.status(500).json({ error: 'Erro inesperado. Tente novamente mais tarde.' });
        } 
    }

    addComentario();
})/*

//IMPORTAR OS COMENTARIOS
app.post('/comment', (req, res) => {
    const {materia} = req.body;
    async function procurar(){
        let resp;
        const comentarios = await ComentarioProvisorio.findOne({where: {materias: materia}})
        if(comentarios){
            resp = comentarios.html
        }
        else if(!comentarios){
            resp = ''
        }
        res.json({html: resp}); 
    }
    procurar()
});
*/

//VERIFICAR LOGIN
app.get('/dashboard', (req, res) => {
    if (!req.session.usuario) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }
      
    res.json({nome: req.session.usuario.nome});
});

//LOGOUT
app.post('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).json({ mensagem: 'Logout bem-sucedido!' });
});

app.listen(port, () => 
    console.log(`Servidor aberto na porta ${port}`)
)

function validarNull(variavel){
    return variavel === '' ? null : variavel
};

const sanitizeHtml = (html) => {
    return html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
};
