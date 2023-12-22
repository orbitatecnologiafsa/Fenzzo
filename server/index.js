const express = require('express');
const path = require('path');
const cors = require('cors');
const firebird = require('node-firebird');
const { log } = require('console');

const app = express();
const port = 3000;

const dbConfig = {
  host: '127.0.0.1',
  port: 3050,
  database: 'C:/Users/orbita/Pictures/indpcp.fdb',
  user: 'SYSDBA',
  password: 'masterkey',
  lowercase_keys: false,
  role: null,
  pageSize: 4096,
};

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

app.post('/vendas', (request, response) => {
  const { vendedor, cnpj, clienteNome, clienteCEP, clienteEndereco, clienteUF, clienteCidade, clienteTelefone, itensVenda, total } = request.body;
  const totall = parseFloat(total)
  firebird.attach(dbConfig, (err, db) => {
    if (err) {
      console.log("Erro ao conectar no banco de dados: ", err);
      response.status(500).send('Erro interno');
      return;
    }
    console.log('Dados antes da execução da query: ', [vendedor,cnpj, clienteNome, clienteCEP, clienteEndereco, clienteUF, clienteCidade, clienteTelefone, totall]);

    // Inserir dados na tabela de vendas
    db.query(
      'INSERT INTO ZVENDAS_TESTE (VENDAS_VENDEDOR, VENDAS_CLI_CNPJ, VENDAS_CLIENTE, VENDAS_ENDERECO, VENDAS_CIDADE, VENDAS_UF, VENDAS_CEP, VENDAS_TELEFONE,VENDAS_TOTAL) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING VENDAS_ID',
      [vendedor, cnpj, clienteNome,clienteEndereco, clienteCidade, clienteUF, clienteCEP, clienteTelefone, totall],
      (err, result) => {
        if (err) {
          console.log('Dados depois da execução da query: ', [vendedor, cnpj, clienteNome, clienteCEP, clienteEndereco, clienteUF, clienteCidade, clienteTelefone, totall]);    
          console.log('Erro ao inserir os dados na tabela de vendas: ', err);
          response.status(500).send('Erro interno do servidor');
          db.detach();
          return;
        }
        console.log('Resultado da inserção na tabela de vendas: ', result);

      const idVenda = result.VENDAS_ID;
      console.log('ID da venda inserida: ', idVenda);

        // Inserir itens de venda associados à venda
        itensVenda.forEach((item) => {
          console.log(item);
          db.query(
            'INSERT INTO ZITENS_VENDAS_TESTE (ITENS_VENDASFK, ITENS_NOME, ITENS_PRECO, ITENS_QTD) VALUES (?, ?, ?, ?)',
            [idVenda, item.nome, item.preco, item.qtd],
            (err, result) => {
              if (err) {
                console.log('Erro ao inserir os itens de venda: ', err);
                response.status(500).send('Erro interno do servidor');
                db.detach();
                return;
              }
            }
          );
        });

        response.send('Dados inseridos com sucesso');
        db.detach();
      }
    );
  });
});

app.get('/produtos', (request, response) => {
  firebird.attach(dbConfig, (err, db) => {
    if (err) {
      console.log("Erro ao conectar no banco de dados: ", err);
      response.status(500).send('Erro interno');
      return;
    }

    db.query('SELECT * FROM ZPRODUTOS_TESTE', [], (err, result) => {
      if (err) {
        console.log('Erro ao buscar produtos: ', err);
        response.status(500).send('Erro interno do servidor');
        db.detach();
        return;
      }

      const produtos = result.map(row => ({
        id: row.PROD_ID,
        nome: row.PROD_NOME,
        preco: row.PROD_PRECO,
        estoque: row.PROD_ESTOQUE
      }));

      response.setHeader('Content-Type', 'application/json');
      response.json(produtos);
      db.detach();
    });
  });
});

app.listen(port, () => {
  console.log('Servidor OK na porta:' + port);
});