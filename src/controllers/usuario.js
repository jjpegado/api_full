const pool = require('../configs/connection')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const senhaJwt = require('../configs/senhaJwt')


const cadastrarUsuario = async (req, res) => {
    const{nome, email, senha} = req.body;
    const queryEmal = `select * from usuarios where email = $1`

    if (!nome || !email || !senha){
        return res.status(400).json({"mensagem": "Algo está faltanddo em nome, email e senha."});
    };

    try {

        const {rowCount} = await pool.query(queryEmal,[email]);

        if(rowCount > 0){
            return res.status(404).json({"mensagem": "O e-mail informado já está sendo utilizado por outro usuário." });
        }

        const senhaCriptografada = await bcrypt.hash(senha,10)
        
        const query = 'insert into usuarios (nome, email, senha) values ($1, $2, $3) returning *';
        const params = [nome, email, senhaCriptografada];
        const novoUsuario = await pool.query(query,params);

        return res.status(201).json(novoUsuario.rows[0]); 
    } catch (error) {
        return res.status(500).json({menssagem : 'Erro interno do servidor'});
    };
};

const loginUsuario = async (req, res) =>{
    const{email, senha} = req.body

    if (!email && !senha){
            return res.status(400).json({"mensagem": "Algo está faltanddo em nome, email e senha."});
     };

    try {
        const query ='select * from usuarios where email = $1'
       const params = [email]
       const usuario = await pool.query(query,params)
       
        if (usuario.rowCount < 1) {
            return res.status(404).json({menssagem : 'Email ou senha incorreta'})
        }
       
        const senhaValida = await bcrypt.compare(senha, usuario.rows[0].senha)
       
        if (!senhaValida) {
           return res.status(404).json({menssagem : 'Email ou senha incorreta'})
        }

        const token = jwt.sign({id: usuario.rows[0].id},senhaJwt, {expiresIn: '8h'})

        const {senha:_, ...usuarioLogado} = usuario.rows[0]
       
        return res.status(200).json({ usuario: usuarioLogado, token})
    } catch (error) {
        return res.status(500).json({menssagem : 'Erro interno do servidor'})
    }
}

const detalharUsuario = async (req, res) => {
    const {senha:_, ...usuarioLogado} = req.usuario

    return res.json(usuarioLogado)     
}

const atualizarUsuario = async(req, res) => {
    const{nome, email, senha} = req.body;
    const {senha:_, ...usuarioLogado} = req.usuario
    const {id} = usuarioLogado
    const queryEmal = `select * from usuarios where email = $1`

    if (!nome || !email || !senha){
        return res.status(400).json({"mensagem": "Algo está faltanddo em nome, email e senha."});
    };

    try {
        const {rows: usuario } = await pool.query(queryEmal,[email]);

        if(usuario[0].email === email && usuario[0].id !== id){
            return res.status(404).json({"mensagem": "O e-mail informado já está sendo utilizado por outro usuário." });         
        }

        const senhaValida = await bcrypt.compare(senha, _)
       
        if (senhaValida) {
           return res.status(404).json({menssagem : 'Não pode atualizar para a mesma senha'})
        }

        const senhaCriptografada = await bcrypt.hash(senha,10)
        
        const query = 'update usuarios set nome = $1, email = $2, senha = $3 where id = $4 returning *';
        const params = [nome, email, senhaCriptografada, id];
        const usuarioAtualizado = await pool.query(query,params);

        return res.status(201).json(usuarioAtualizado.rows[0]); 
    } catch (error) {
         return res.status(500).json({menssagem : 'Erro interno do servidor'})
    }
}

const listarCategorias = async (req, res) => {

    try {
        const query = 'select * from categorias';
        const categorias = await pool.query(query);

        return res.status(201).json(categorias.rows); 
    } catch (error) {
        return res.status(500).json({menssagem : 'Erro interno do servidor'})
    }
}

// const cadastrarTransacao = async (req,res) => {
//     const{tipo, descricao, valor, data, categoria_id} = req.body;
//     const {senha:_, ...usuarioLogado} = req.usuario
//     const {id} = usuarioLogado
//     const queryId = `select * from categorias where id = $1`

//     if (!tipo || !descricao || !valor || !data || !categoria_id){
//         return res.status(400).json({"mensagem": "Todos os campos obrigatórios devem ser informados."});
//     };

//     if (tipo != "entrada" && tipo != "saida") {    
//         return res.status(400).json({"mensagem": "O tipo está incorreto."});
//     } 

//     try {

//         const {rowCount} = await pool.query(queryId,[categoria_id]);

//         if(rowCount < 1){
//             return res.status(404).json({"mensagem": "Categoria não existente" }); 
//         }

//             const query = 'insert into transacoes (tipo, descricao, valor, data, categoria_id, usuario_id) values ($1, $2, $3, $4, $5, $6) returning *';
//             const params = [tipo, descricao, valor, data, categoria_id, id];
//             const novaTransacao = await pool.query(query,params);      
//             return res.status(201).json(novaTransacao.rows[0]); 
//     } catch (error) {
//         return res.status(500).json({menssagem : 'Erro interno do servidor'})
//     }
// }

// const listarTransacoes = async(req, res) =>{
//     const {senha:_, ...usuarioLogado} = req.usuario
//     const {id} = usuarioLogado
//     const { filtro } = req.query
//     let filtrar;
//     let transacoesFiltradas = [];

//     try {
//         const query = 'select t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao AS categoria_nome from transacoes t join categorias c ON t.categoria_id =c.id where t.usuario_id = $1';
//         const transacoes = await pool.query(query,[id]);

//         if(filtro){
//            for (let i in filtro){
//             filtrar = transacoes.rows.filter(transacao => {
//                 return transacao.categoria_nome === filtro[i]
//             });
           
//             transacoesFiltradas = transacoesFiltradas.concat(filtrar);
//            }
//            return res.status(200).json(transacoesFiltradas)
//         }

//         return res.status(201).json(transacoes.rows); 
//     } catch (error) {
//         return res.status(500).json({menssagem : 'Erro interno do servidor'})
//     }
// }

// const detalharUmaTransacao = async(req, res) =>{
//     const {idTransacao} = req.params
//     const {senha:_, ...usuarioLogado} = req.usuario
//     const {id} = usuarioLogado

//     try {

//         const query = 'select * from transacoes where id = $1 and usuario_id = $2'; 
//         const params = [idTransacao,id]
//         const {rowCount, rows} = await pool.query(query,params);

//         if(rowCount < 1){
//             return res.status(404).json({"mensagem": "Transação não encontrada."}); 
//         }

//         return res.status(201).json(rows); 
//     } catch (error) {
//         return res.status(500).json({menssagem : 'Erro interno do servidor'})
//     }
// }

// const atualizarTransacaoUsuario = async(req, res) =>{
//     const{tipo, descricao, valor, data, categoria_id} = req.body;
//     const {idTransacao} = req.params
//     const {senha:_, ...usuarioLogado} = req.usuario
//     const {id} = usuarioLogado

//     if (!tipo || !descricao || !valor || !data || !categoria_id){
//         return res.status(400).json({"mensagem": "Todos os campos obrigatórios devem ser informados."});
//     };

//     if (tipo != "entrada" && tipo != "saida") {    
//         return res.status(400).json({"mensagem": "O tipo está incorreto."});
//     } 

//     try {

//         const queryId = `select * from categorias where id = $1`
//         const categoriaId = await pool.query(queryId,[categoria_id]);
        
//         if(categoriaId.rowCount < 1){
//             return res.status(404).json({"mensagem": "Categoria não existente" });
            
//         }

//         const queryTransacao = 'select * from transacoes where id = $1 and usuario_id = $2'; 
//         const {rowCount} = await pool.query(queryTransacao,[idTransacao,id]);
        
//         if(rowCount < 1){
//             return res.status(404).json({"mensagem": "Transação não encontrada."}); 
//         }

//         const query = 'update transacoes set tipo = $1, descricao = $2, valor = $3, data = $4, categoria_id = $5 where id = $6 returning *';
//         const params = [tipo, descricao, valor, data, categoria_id, idTransacao];
//         const transacaoDoUsuarioAtualizada = await pool.query(query,params);

//         return res.status(201).json(transacaoDoUsuarioAtualizada.rows[0]); 

//     } catch (error) {
//         return res.status(500).json({menssagem : 'Erro interno do servidor'}) 
//     }
// }

// const excluirTransacoes = async(req, res) =>{
//     const {idTransacao} = req.params
//     const {senha:_, ...usuarioLogado} = req.usuario
//     const {id} = usuarioLogado

//     try {

//         const queryTransacao = 'select * from transacoes where id = $1 and usuario_id = $2'; 
//         const {rowCount} = await pool.query(queryTransacao,[idTransacao,id]);
        
//         if(rowCount < 1){
//             return res.status(404).json({"mensagem": "Transação não encontrada."}); 
//         }

//         await pool.query('delete from transacoes where id = $1', [idTransacao])

//         return res.status(204).send()
//     } catch (error) {
//         return res.status(500).json({menssagem : 'Erro interno do servidor'})
//     }
// }

// const extratoTransacoes = async (req, res) => {
//     const id = req.usuario.id

//     try {
//         const querySaida = 'SELECT COALESCE(SUM(valor), 0) AS Saida FROM transacoes WHERE usuario_id = $1 AND tipo = $2'; 
//         const {rows:saiu} = await pool.query(querySaida,[id, 'saida']);

//         const queryEntrada = 'SELECT COALESCE(SUM(valor), 0) AS Entrada FROM transacoes WHERE usuario_id = $1 AND tipo = $2'; 
//         const {rows:entrou} = await pool.query(queryEntrada,[id, 'entrada'])

//         const {entrada} = entrou[0]
//         const {saida} = saiu[0]
//         const extrato = {entrada, saida}
//         return res.status(201).send(extrato)
//     } catch (error) {
//         return res.status(500).json(error)
//     }

// }




module.exports = {
    cadastrarUsuario,
    loginUsuario,
    detalharUsuario,
    atualizarUsuario,
    listarCategorias,
};