const express = require('express');
const path = require('path');
const cors = require('cors');
const vendasController = require('./controllers/vendasController');
const produtosController = require('./controllers/produtosController');
const clienteController = require('./controllers/clienteController');
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
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/produtos',(request, response) => vendasController.buscarProdutosVendas(request, response, dbConfig));
app.get('/clientes',(request, response) => clienteController.buscarCliente(request, response, dbConfig))
app.get('/vendedores',(request, response) => clienteController.buscarVendedor(request, response, dbConfig))
app.get('/prods',(request, response) => produtosController.buscarProdutos(request, response, dbConfig));
app.get('/imagens',(request, response) => produtosController.buscarImagens(request, response, dbConfig));


var login = "admin";
var senha = "admin";

app.get('/', (req, res) => {
  if (req.session.login) {
    res.sendFile(path.join(__dirname, '..', 'client', 'Home.html'));
  } else {
    res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
  }
});

app.post('/login', (req, res) => {
  if (req.body.login == login && req.body.senha == senha) {
    req.session.login = login;
    res.sendFile(path.join(__dirname, '..', 'client', 'Home.html'));
  } else {
    res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
  }
});


app.post('/vendas', (request, response) => vendasController.realizarVenda(request, response, dbConfig));






app.listen(port, () => {
  console.log('Servidor OK na porta:' + port);
});


// [codigoCliente,vendedor, cnpj, clienteNome, clienteCEP, clienteEndereco, clienteUF, clienteCidade, clienteTelefone, totall]