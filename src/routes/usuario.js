const rota = require('express').Router()
const controladorUsuario = require('../controllers/usuario')
const controladorTransacao = require('../controllers/transacoes')
const {verificarUsuarioLogado} = require('../middlewares/autenticador')

rota.post("/usuario", controladorUsuario.cadastrarUsuario);
rota.post("/login", controladorUsuario.loginUsuario);

rota.use(verificarUsuarioLogado)

rota.get("/usuario", controladorUsuario.detalharUsuario);
rota.put("/usuario", controladorUsuario.atualizarUsuario);
rota.get("/categoria",  controladorUsuario.listarCategorias);

rota.post("/transacao",  controladorTransacao.cadastrarTransacao);
rota.get("/transacao",  controladorTransacao.listarTransacoes);

rota.get("/transacao/extrato",  controladorTransacao.extratoTransacoes);

rota.get("/transacao/:idTransacao",  controladorTransacao.detalharUmaTransacao);
rota.put("/transacao/:idTransacao",  controladorTransacao.atualizarTransacaoUsuario);
rota.delete("/transacao/:idTransacao",  controladorTransacao.excluirTransacoes);


module.exports = rota