const express = require('express');
const path = require('path');
const cors = require('cors');
const vendasController = require('./controllers/vendasController');
const produtosController = require('./controllers/produtosController');
const clienteController = require('./controllers/clienteController');
const pedidosController = require('./controllers/pedidosController');
const loginController = require('./controllers/loginController');
require('dotenv').config();
const session = require('express-session');
const bodyParser = require('body-parser');





const app = express();
const port = 3000;

const dbConfig = {
  host:  process.env.DB_HOST ,
  port: process.env.DB_PORT ,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  lowercase_keys: false,
  role: null,
  pageSize: 4096,
  blobAsBase64: false,
  encoding: 'UTF-8',

};
//BANCO CERTO 'C:/IndPCP/DB/indpcp.fdb'
// 192.168.15.30

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '..','client')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((request, response, next) => {
  console.log(`Requisição ${request.method} em ${request.url}`);
  next();
});
var loginID = [];
// Middleware de autenticação
function isAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) {
    next();
  } else {
    response.status(401).redirect('/index.html');
  }
}

// GET
app.get('/produtos', (request, response) => vendasController.buscarProdutosVendas(request, response, dbConfig));
// app.get('/exibir', (request, response) => vendasController.buscarProdutosExibir(request, response, dbConfig));
app.get('/pagamentos', (request, response) => vendasController.buscarPagamentos(request, response, dbConfig));
app.get('/clientes', (request, response) => clienteController.buscarCliente(request, response, dbConfig, loginID));
app.get('/vendedores', (request, response) => clienteController.buscarVendedor(request, response, dbConfig))
app.get('/prods', (request, response) => produtosController.buscarProdutos(request, response, dbConfig));
app.get('/imagens', (request, response) => produtosController.buscarImagens(request, response, dbConfig));
app.get('/pedidos', (request, response) => pedidosController.buscarPedidos(request, response, dbConfig, loginID));
app.get('/pedidosItens/:id', (request, response) => pedidosController.buscarItensPedido(request, response, dbConfig));
app.get('/cores/:id', (request, response) => vendasController.buscarCoresDisponiveis(request, response, dbConfig));
// POST
app.post('/vendas', (request, response) => vendasController.realizarVenda(request, response, dbConfig));
app.post('/login', (request, response) => {
  loginController.realizarLogin(request, response, dbConfig, (result) => {
      if (result.success) {
          response.redirect('/home.html');
          loginID.push(result.vendedorId);
          
      } else {
          response.status(401).redirect('/index.html');
          response.end();
      }
  });
});
// PUT
app.put('/pedidos/:id',(request, response) => pedidosController.editarPedidos(request, response, dbConfig));
// DELETE
app.delete('/pedidos/:id',(request, response) => pedidosController.excluirItensPedidos(request, response, dbConfig));


// var login = "admin";
// var senha = "admin";

// app.get('/', (req, res) => {
//   if (req.session.vendedorId) {
//     console.log(req.session.vendedorId);
//     res.sendFile(path.join(__dirname, '..', 'client', 'Home.html'));
//   } else {
//     res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
//   }
// });



// app.post('/login', (req, res) => {
//   console.log(req.body.login, req.body.senha);
//   if (req.body.login == login && req.body.senha == senha) {
//     req.session.login = login;
//     res.sendFile(path.join(__dirname, '..', 'client', 'Home.html'));
//   } else {
//     res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
//   }
// });



app.listen(port, () => {
  console.log('Servidor OK na porta:' + port);
});


//POST do login e senha >>>> verifica no banco >>> SE SIM, FAZ O LOGIN >>> SE NÃO, RETORNA ERRO
//Agora como fazer isso ? >>> Criar uma rota para isso.
//Como ficaria essa rota ? >>> localhost:3000/login
//A rota recolhe os dados do login e senha e faz o login.
//Qual a função que vai mandar os dados pro banco fazer a autenticação ? >>> POST

