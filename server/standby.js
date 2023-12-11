// const express = require('express');
// const path = require('path');
// const cors = require('cors');
// const axios = require('axios');
// const firebird = require('node-firebird');

// const app = express();
// const port = 3000;

// const dbConfig = {
//   host: '127.0.0.1',
//   port: 3050,
//   database: 'C:/Users/orbita/Pictures/indpcp.fdb',
//   user: 'SYSDBA',
//   password: 'masterkey',
//   lowercase_keys: false,
//   role: null,
//   pageSize: 4096,
// };

// app.use(express.json());
// app.use(cors());
// app.use(express.static(path.join(__dirname, '..','client')));
// app.use(express.urlencoded({ extended: true }));

// const pathToVendas = path.resolve(__dirname, '..', 'client', 'vendas.html');
// console.log("__dirname:", __dirname);
// console.log("pathToIndex:", pathToVendas);
// app.get('/vendas', (req, res) => {
//   res.sendFile(pathToVendas);
// });



// app.post('/vendas', (request, response) => {
//   const { vendedor, cnpj, clienteNome, clienteCEP, enderecoCliente, clienteUF, clienteCidade, clienteTelefone } = request.body;

//   firebird.attach(dbConfig, (err, db) => {
//     if (err) {
//       console.log("Erro ao conectar no banco de dados: ", err);
//       response.status(500).send('Erro interno');
//       return;
//     }

//     db.query('INSERT INTO VENDAS_TESTE (TESTE_VENDEDOR, TESTE_CNPJ, TESTE_CLIENTE, TESTE_ENDERECO, TESTE_UF, TESTE_CEP, TESTE_PRECO_FINAL) VALUES (?, ?, ?, ?, ?, ?, ?)',
//       [vendedor, cnpj, clienteNome, clienteCEP, enderecoCliente, clienteUF, 7], (err, result) => {

//         if (err) {
//           console.log('Erro ao inserir os dados no banco de dados: ', err);
//           response.status(500).send('Erro interno do servidor');
//           return;
//         }
//         console.log('Dados inseridos no banco de dados: ', result);
//         response.send('Dados inseridos com sucesso');
//         db.detach();
//       });
//   });
// });

// app.get('/produtos', (request, response) => {
//   firebird.attach(dbConfig, (err, db) => {
//     if (err) {
//       console.log("Erro ao conectar no banco de dados: ", err);
//       response.status(500).send('Erro interno');
//       return;
//     }

//     db.query('SELECT * FROM PRODUTOS_TESTE', [], (err, result) => {
//       if (err) {
//         console.log('Erro ao buscar produtos: ', err);
//         response.status(500).send('Erro interno do servidor');
//         return;
//       }

//       const produtos = result.map(row => ({
//         id: row.PROD_ID,
//         nome: row.PROD_NOME,
//         preco: row.PROD_PRECO
//       }));

//       response.setHeader('Content-Type', 'application/json');
//       response.json(produtos);
//       db.detach();
//     });
//   });
// });


// app.listen(port, () => {
//   console.log('Servidor OK na porta:' + port);
// });
