const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const allitens = require('./interactions');
const port = 3000;




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


// app.get('/', (req, res) => {
//     const query = allitens();
//     return res.status(202).json(query);
// })


app.get('/produtos', async (req, res) => {
    const query = await allitens();
    const produtos = query.map(row => ({
                id: row.PROD_ID,
                nome: row.PROD_NOME,
                preco: row.PROD_PRECO,
                qtd: row.PROD_QUANTIDADE,
                estoque: row.PROD_ESTOQUE
              }));

    
    return res.status(202).json(produtos);
  });
;



app.listen(port, () => {
  console.log('Servidor OK na porta:' + port);
});