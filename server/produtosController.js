// produtosController.js
const firebird = require('node-firebird');

function buscarProdutos(request, response) {
    firebird.attach(dbConfig, (err, db) => {
    if (err) {
      console.log("Erro ao conectar no banco de dados: ", err);
      response.status(500).send('Erro interno');
      return;
    }

    db.query('SELECT * FROM CAD_PRODUTOS', [], (err, result) => {
      if (err) {
        console.log('Erro ao buscar produtos: ', err);
        response.status(500).send('Erro interno do servidor');
        db.detach();
        return;
      }

      const produtos = result.map(row => ({
        id: row.CODIGO,
        nome: row.DESCRICAO,
        preco: row.PRC_VENDA,
        
      }));

      response.setHeader('Content-Type', 'application/json');
      response.json(produtos);
      db.detach();
    });
  });
}

module.exports = {
  buscarProdutos,
};