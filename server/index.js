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
  host:  process.env.DB_HOST || '192.168.0.109',
  port: process.env.DB_PORT || 3050,
  database: process.env.DB_DATABASE || 'C:/Users/orbita/Pictures/indpcp.fdb',
  user: process.env.DB_USER || 'SYSDBA',
  password: process.env.DB_PASSWORD || 'masterkey',
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



app.get('/produtos', vendasController.buscarProdutos);
app.get('/clientes', clienteController.buscarCliente)
app.get('/vendedores', clienteController.buscarVendedor)
app.get('/prods', produtosController.buscarProdutos);




app.post('/vendas', vendasController.realizarVenda);

app.listen(port, () => {
  console.log('Servidor OK na porta:' + port);
});


// [codigoCliente,vendedor, cnpj, clienteNome, clienteCEP, clienteEndereco, clienteUF, clienteCidade, clienteTelefone, totall]