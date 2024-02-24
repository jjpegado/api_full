const jwt = require('jsonwebtoken')
const senhaJwt = require('../configs/senhaJwt')
const pool = require('../configs/connection')

const verificarUsuarioLogado = async (req, res, next) => {
    const { authorization } = req.headers

    if(!authorization) {
        return res.status(401).json({ menssagem: 'Acesso negado' })
    }
    
    const token = authorization.split(' ')[1]

	try {
        const { id } = jwt.verify(token, senhaJwt)

        const query ='select * from usuarios where id = $1'
        const params = [id]
        const {rows, rowCount} = await pool.query(query,params)
        
        if (rowCount < 1) {
            return res.status(401).json({menssagem : 'Não autorizado'})
        }
        
        req.usuario = rows[0]

        next()
    } catch (error) {
        return res.status(401).json({"mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado."})
    }
}

module.exports = {
    verificarUsuarioLogado
};