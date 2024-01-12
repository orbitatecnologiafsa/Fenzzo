const express = require('express');
const path = require('path');
const cors = require('cors');
const vendasController = require('./vendasController');
const produtosController = require('./produtosController');
const clienteController = require('./clienteController');
require('dotenv').config();

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
};
//BANCO CERTO 'C:/IndPCP/DB/indpcp.fdb'
// 192.168.15.30
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '..','client')));
app.use(express.urlencoded({ extended: true }));

const pathToVendas = path.resolve(__dirname, '..', 'client', 'vendas.html');
console.log("__dirname:", __dirname);
console.log("pathToIndex:", pathToVendas);
app.get('/vendas', (req, res) => {
  res.sendFile(pathToVendas);
});


app.post('/vendas', vendasController.realizarVenda);

app.get('/produtos',(request, response) => vendasController.buscarProdutos(request, response, dbConfig));
app.get('/clientes',(request, response) => clienteController.buscarCliente(request, response, dbConfig))
app.get('/vendedores',(request, response) => clienteController.buscarVendedor(request, response, dbConfig))
app.get('/prods',(request, response) => produtosController.buscarProdutos(request, response, dbConfig));





app.listen(port, () => {
  console.log('Servidor OK na porta:' + port);
});


// [codigoCliente,vendedor, cnpj, clienteNome, clienteCEP, clienteEndereco, clienteUF, clienteCidade, clienteTelefone, totall]